import Vue from "vue";
import { ConnectionHTTP, ConnectionTCP } from "node-vmix";
import Axios from "axios";

// vMix connection plugin for Vue
// Implemented with inspiration from
//  - https://vuejs.org/v2/guide/plugins.html
//  - https://codepen.io/stigaard/pen/yLNNQbg
export class VMixConnectionPluginStore {
  host = null;
  xpathPreviousValues = {};
  xpathCallbacks = {};
  pollHttpStateTimeout = null;

  constructor() {
    this.storeVM = new Vue({
      data: {
        internal: {
          connection: null,
          connected: false,
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
   * @param {string} host
   */
  async setConnection(host) {
    this.host = host;

    const [hostname, port] = host.split(":");
    this.storeVM.$data.internal.connection = new ConnectionHTTP(hostname, port);
    this.storeVM.$data.internal.connected = await VMixConnectionPluginStore.canConnect(
      host
    );

    this.pollHttpState();
  }

  pollHttpState() {
    this.pollHttpStateTimeout = setInterval(async () => {
      let data;
      try {
        // eslint-disable-next-line prefer-destructuring
        data = (await Axios.get(`http://${this.host}/api`)).data;
        this.storeVM.$data.internal.connected = true;
      } catch (err) {
        if (err.message === "Network Error") {
          this.storeVM.$data.internal.connected = false;
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
    } else if (
      this.storeVM.$data.internal.connection instanceof ConnectionHTTP
    ) {
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
      options = {},
      keepListeners = false
    ) {
      if (!keepListeners) {
        this.xpathCallbacks = {};
        this.xpathPreviousValues = {};
      }
      this.$vMixConnection.setConnection(host, options);
    };
    Vue.prototype.execVmixCommands = function execVmixCommands(commands) {
      this.$vMixConnection.send(commands);
    };
  },
};
export default vMixConnectionPlugin;
