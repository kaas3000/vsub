<template>
  <v-app id="inspire">
    <v-app-bar app :color="accentColor" dark>
      <v-toolbar-title>GKV Lied Ondertiteling</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="save"><v-icon>mdi-content-save</v-icon></v-btn>
      <v-btn icon @click="open"><v-icon>mdi-folder-open</v-icon></v-btn>
      <v-btn icon to="/settings"><v-icon>mdi-cog</v-icon></v-btn>
      <div class="mx-4"></div>

      <v-btn
        icon
        @click="isLive ? disableLive() : enableLive()"
        ref="toggleLiveButton"
        :loading="isLiveTransitioning"
        :disabled="!isVmixConnected"
        v-shortkey="['space']"
        @shortkey="isVmixConnected && (isLive ? disableLive() : enableLive())"
      >
        <v-icon>{{ isLive ? "mdi-stop" : "mdi-play" }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer :color="accentColor" app>
      <span class="white--text">GKV 2019 {{ ip }}:8067</span>
    </v-footer>
  </v-app>
</template>

<script>
const ip = require("ip");

export default {
  props: {
    source: String,
  },

  data: () => ({
    drawer: null,
    ip: ip.address(),

    isLive: false,
    isLiveTransitioning: false,

    // The tally uses the index instead of the name of the input
    vmixInputIndex: null,

    vmixConnectionInterval: null,
  }),

  computed: {
    accentColor() {
      if (!this.isVmixConnected) return "secondary";
      if (this.isLive) return "orange";
      return "primary";
    },
    isVmixConnected() {
      return this.$vMixConnection.connected;
    },
  },

  watch: {
    isVmixConnected: function vmixConnectionChange(val) {
      this.handleVmixConnectionChange(val);
    },
  },

  methods: {
    setLiveFromTally(tallyData) {
      if (this.vmixInputIndex === null) {
        return;
      }

      this.isLiveTransitioning = false;
      this.isLive = tallyData.program.includes(this.vmixInputIndex);
    },

    enableLive() {
      this.isLiveTransitioning = true;
      this.execVmixCommands({
        Function: `OverlayInput${this.$store.state.Settings.vmixOverlay}In`,
        Input: this.$store.state.Settings.vmixInputName,
      });
    },

    disableLive() {
      this.isLiveTransitioning = true;
      this.execVmixCommands({
        Function: `OverlayInput${this.$store.state.Settings.vmixOverlay}Out`,
        Input: this.$store.state.Settings.vmixInputName,
      });
    },

    setSubtitleInputIndexFromState(xml) {
      const xmlDocument = new DOMParser().parseFromString(xml, "text/xml");

      // Query the input number from the xml document using xpath
      const xpathResult = xmlDocument.evaluate(
        `/vmix/inputs//input[@title="${this.$store.state.Settings.vmixInputName}"]/@number`,
        xmlDocument,
        document.createNSResolver(xmlDocument.documentElement),
        XPathResult.NUMBER_TYPE,
        null
      );

      if (xpathResult.numberValue) {
        this.vmixInputIndex = xpathResult.numberValue;
      }

      // With a new id, the tally state has to be updated too
      this.execVmixCommands("TALLY");
    },

    open() {
      const fs = require("fs");
      const { dialog } = require("electron").remote;

      const [location] = dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Liturgie (*.json)", extensions: ["json"] }],
      });

      const data = fs.readFileSync(location, { encoding: "utf8" });

      this.$store.dispatch("loadSongs", JSON.parse(data));
    },
    save() {
      const fs = require("fs");
      const { dialog } = require("electron").remote;

      const location = dialog.showSaveDialog({
        filters: [{ name: "Liturgie (*.json)", extensions: ["json"] }],
      });
      const data = JSON.stringify(this.$store.state.Songs.songs);
      fs.writeFileSync(location, data, { encoding: "utf8" });
    },

    handleVmixConnectionChange(newVal) {
      if (newVal === false) {
        this.vmixConnectionInterval = setInterval(() => {
          this.setVmixConnection(this.$store.state.Settings.vmixHost, {
            autoReconnect: false,
          });
        }, 1000);
      } else {
        clearInterval(this.vmixConnectionInterval);

        this.$vMixConnection.on("tally", this.setLiveFromTally);
        this.$vMixConnection.on("tally", () => this.execVmixCommands("XML"));
        this.execVmixCommands("SUBSCRIBE TALLY");

        // Request the input index
        this.$vMixConnection.on("xml", this.setSubtitleInputIndexFromState);
        this.execVmixCommands("XML");
      }
    },
  },

  mounted() {
    // Connect to vmix using the reconnect functionality
    this.handleVmixConnectionChange(false);
  },
};
</script>

<style lang="scss">
#inspire {
  max-height: 100vh;
}

.overflow-y {
  overflow-y: auto;
  height: 100%;
}

.v-card {
  &.active::before {
    opacity: 0.08;
  }
}

.v-content {
  height: 100%;
}
</style>
