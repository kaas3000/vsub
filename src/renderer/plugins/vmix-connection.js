import Vue from "vue";
import { ConnectionHTTP, ConnectionTCP } from "node-vmix";
import Axios from "axios";
import VmixConnectionState from "../VmixConnection/vmixConnectionState";
import UnknownVmixConnectionStateError from "../VmixConnection/UnknownVmixConnectionStateError";

// vMix connection plugin for Vue
// Implemented with inspiration from
//  - https://vuejs.org/v2/guide/plugins.html
//  - https://codepen.io/stigaard/pen/yLNNQbg
export class VMixConnectionPluginStore {
  host = null;
  xpathPreviousValues = {};
  xpathCallbacks = {};
  pollHttpStateTimeout = null;

  activeInput = null;

  constructor() {
    this.storeVM = new Vue({
      data: {
        internal: {
          connection: null,
          inputName: null,
          overlayIndex: null,
          connected: VmixConnectionState.DISCONNECTED,
        },
      },
    });
  }
  get connection() {
    return this.storeVM.$data.internal.connection;
  }

  get connected() {
    return this.storeVM.$data.internal.connected;
  }

  /**
   * @param {string} state
   */
  set connected(state) {
    if (!Object.prototype.hasOwnProperty.call(VmixConnectionState, state)) {
      throw new UnknownVmixConnectionStateError(state);
    }

    this.storeVM.$data.internal.connected = state;
  }

  /**
   * @param {string} host
   * @param {string} inputName
   * @param {Number} overlayIndex
   */
  async connect(host, inputName, overlayIndex) {
    this.host = host;

    this.storeVM.$data.internal.inputName = inputName;
    this.storeVM.$data.internal.overlayIndex = overlayIndex;

    const [hostname, port] = host.split(":");
    this.storeVM.$data.internal.connection = new ConnectionHTTP(hostname, port);

    /**
     * Check title availability
     */
    this.watchXpath(`/vmix/inputs//input[@title="${this.storeVM.$data.internal.inputName}"]/@number`, (inputIndex) => {
      const index = parseInt(inputIndex, 10);

      if (this.connected !== VmixConnectionState.DISCONNECTED && Number.isNaN(index)) {
        this.connected = VmixConnectionState.CONNECTED;
        return false;
      }

      this.storeVM.$data.internal.overlayIndex = index;
      return true;
    });

    /**
     * Check live (aka, the overlay is active)
     */
    this.watchXpath(`/vmix/overlays/overlay[@number=${this.storeVM.$data.internal.overlayIndex}]`, (activeInput) => {
      this.activeInput = parseInt(activeInput, 10);

      if (this.connected !== VmixConnectionState.LIVE) {
        this.connected =
          this.storeVM.$data.internal.overlayIndex === this.activeInput
            ? VmixConnectionState.LIVE
            : VmixConnectionState.READY;
      }
      if (
        this.connected === VmixConnectionState.LIVE &&
        this.storeVM.$data.internal.overlayIndex !== this.activeInput
      ) {
        this.connected = VmixConnectionState.READY;
      }
    });

    this.pollHttpState();
  }

  pollHttpState() {
    this.pollHttpStateTimeout = setInterval(async () => {
      let data;
      try {
        // eslint-disable-next-line prefer-destructuring
        data = (await Axios.get(`http://${this.host}/api`)).data;

        if (this.connected === VmixConnectionState.DISCONNECTED) {
          this.connected = VmixConnectionState.CONNECTED;
        }
      } catch (err) {
        if (err.message === "Network Error") {
          this.connected = VmixConnectionState.DISCONNECTED;
          return;
        }
      }

      Object.entries(this.xpathCallbacks).forEach(([xpath, callback]) => {
        const xmlDocument = new DOMParser().parseFromString(data, "text/xml");
        const xpathResult = xmlDocument.evaluate(
          xpath,
          xmlDocument,
          document.createNSResolver(xmlDocument.documentElement),
          XPathResult.STRING_TYPE,
          null
        );

        if (this.xpathPreviousValues[xpath] !== xpathResult.stringValue) {
          callback(xpathResult.stringValue);
        }
        this.xpathPreviousValues[xpath] = xpathResult.stringValue;
      });
    }, 500);
  }

  /**
   *
   * @param {string} host
   */
  static async canConnect(host) {
    let status;
    try {
      // eslint-disable-next-line prefer-destructuring
      status = (await Axios.get(`http://${host}/api`, { timeout: 500 })).status;
    } catch (err) {
      return false;
    }

    return status >= 200 && status < 300;
  }

  async send(commands) {
    if (this.storeVM.$data.internal.connection instanceof ConnectionTCP) {
      this.storeVM.$data.internal.connection.send(commands);
    } else if (this.storeVM.$data.internal.connection instanceof ConnectionHTTP) {
      if (!Array.isArray(commands)) {
        return Axios.get(`http://${this.host}/api`, { params: commands });
      }

      commands.reduce(async (_, command) => {
        await Axios.get(`http://${this.host}/api`, { params: command });
      });
    } else {
      throw new Error("Unexpected connection type");
    }

    return Promise.resolve([]);
  }
  on(type, cb) {
    this.storeVM.$data.internal.connection.on(type, cb);
  }

  /**
   *
   * @param {string} xpath
   * @param {Function} callback
   */
  watchXpath(xpath, callback) {
    this.xpathPreviousValues[xpath] = null;
    this.xpathCallbacks[xpath] = callback;
  }

  clearWatchedXpath(xpath) {
    delete this.xpathCallbacks[xpath];
    delete this.xpathPreviousValues[xpath];
  }
}

const vMixConnectionPlugin = {
  install(Vue, store) {
    Vue.mixin({
      beforeCreate() {
        this.$vMixConnection = store;
      },
    });
    // Global method - set vMix connection
    Vue.prototype.setVmixConnection = function setVmixConnection(
      host,
      inputName,
      overlayIndex,
      options = {},
      keepListeners = false
    ) {
      if (!keepListeners) {
        this.$vMixConnection.xpathCallbacks = {};
        this.$vMixConnection.xpathPreviousValues = {};
      }
      this.$vMixConnection.connect(host, inputName, overlayIndex, options);
    };
    Vue.prototype.execVmixCommands = function execVmixCommands(commands) {
      this.$vMixConnection.send(commands);
    };
  },
};
export default vMixConnectionPlugin;
