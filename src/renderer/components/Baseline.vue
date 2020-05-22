<template>
  <v-app id="inspire">
    <v-app-bar app :color="accentColor" dark>
      <v-toolbar-title>GKV Lied Ondertiteling</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="isLive ? disableLive() : enableLive()"
        ref="toggleLiveButton"
        :loading="isLiveTransitioning"
      >
        <v-icon>{{ isLive ? "mdi-stop" : "mdi-play" }}</v-icon>
      </v-btn>
      <v-btn icon to="/settings"><v-icon>mdi-cog</v-icon></v-btn>
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
// eslint-disable-next-line import/no-extraneous-dependencies
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

      this.vmixInputIndex = xpathResult.numberValue;

      // With a new id, the tally state has to be updated too
      this.execVmixCommands("TALLY");
    },
  },

  mounted() {
    this.setVmixConnection(this.$store.state.Settings.vmixHost, {
      autoReconnect: true,
    });

    this.$vMixConnection.on("tally", this.setLiveFromTally);
    this.execVmixCommands("SUBSCRIBE TALLY");

    // Request the input index
    this.$vMixConnection.on("xml", this.setSubtitleInputIndexFromState);
    this.execVmixCommands("XML");
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
