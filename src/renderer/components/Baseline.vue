<template>
  <v-app id="inspire">
    <v-app-bar app :color="accentColor" dark clipped-left>
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
        :disabled="!(isReadyForLive || isLive)"
        v-shortkey="['space']"
        @shortkey="vmixConnectionState && (isLive ? disableLive() : enableLive())"
      >
        <v-icon>{{ isLive ? "mdi-stop" : "mdi-play" }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="max-size-screen">
      <v-container fluid class="h-100 pb-0">
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer color="primary white--text" app>
      <span>
        VMix connection:
        <v-badge dot inline :color="vmixConnectionColor"></v-badge>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import VmixConnnectionState from "@/vmixConnection/VmixConnectionState";
// eslint-disable-next-line no-unused-vars
import { ConnectionTCP, ConnectionHTTP } from "node-vmix";
const ip = require("ip");

export default {
  props: {
    source: String,
  },

  data: () => ({
    drawer: null,
    ip: ip.address(),

    isLiveTransitioning: false,

    // The tally uses the index instead of the name of the input
    vmixInputIndex: null,
    isVmixTitleAvailable: false,

    vmixConnectionInterval: null,
  }),

  computed: {
    accentColor() {
      if (!this.vmixConnectionState === VmixConnnectionState.READY) return "secondary";

      if (this.isLive) return "red";

      return "green";
    },

    vmixConnectionState() {
      return this.$vMixConnection.connected;
    },

    vmixConnectionColor() {
      if (
        this.vmixConnectionState === VmixConnnectionState.READY ||
        this.vmixConnectionState === VmixConnnectionState.LIVE
      ) {
        return "green";
      }

      if (this.vmixConnectionState === VmixConnnectionState.CONNECTED) {
        return "orange";
      }

      return "red";
    },

    isReadyForLive() {
      return this.vmixConnectionState === VmixConnnectionState.READY;
    },

    isLive() {
      return this.vmixConnectionState === VmixConnnectionState.LIVE;
    },
  },

  watch: {
    isLive: function isLiveWatcher() {
      this.isLiveTransitioning = false;
    },

    "$store.state.Settings.vmixHost": function reconnect() {
      this.connectToVMix();
    },
    "$store.state.Settings.vmixInputName": function reconnect() {
      this.connectToVMix();
    },
    "$store.state.Settings.vmixOverlay": function reconnect() {
      this.connectToVMix();
    },
  },

  methods: {
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

    connectToVMix() {
      this.setVmixConnection(
        this.$store.state.Settings.vmixHost,
        this.$store.state.Settings.vmixInputName,
        this.$store.state.Settings.vmixOverlay,
        {
          autoReconnect: false,
        }
      );
    },
  },

  mounted() {
    this.connectToVMix();
  },
};
</script>

<style lang="scss">
#inspire {
  max-height: 100vh;
}

.max-size-screen {
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

.row,
.container {
  max-height: 100%;
}
</style>
