<template>
  <v-app id="inspire">
    <v-app-bar app :color="accentColor" dark clipped-left collapse-on-scroll>
      <v-toolbar-title>GKV Lied Ondertiteling</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-badge offset-x="18" offset-y="18" :value="hasUnsavedChanges" overlap dot>
        <v-btn icon @click="save" :disabled="isLive" v-shortkey="!isLive ? ['ctrl', 's'] : []" @shortkey="save">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-badge>
      <v-btn icon @click="open" :disabled="isLive"><v-icon>mdi-folder-open</v-icon></v-btn>
      <v-btn icon to="/settings" :disabled="isLive"><v-icon>mdi-cog</v-icon></v-btn>
      <div class="mx-4"></div>

      <v-btn
        icon
        @click="isLive ? disableLive() : enableLive()"
        ref="toggleLiveButton"
        :loading="isLiveTransitioning"
        :disabled="!(isReadyForLive || isLive)"
        v-shortkey="isReadyForLive || isLive ? ['space'] : []"
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

      <span v-if="currentFile">
        <v-icon small color="white">mdi-file-document</v-icon> {{ currentFile | baseName }}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import VmixConnnectionState from "@/vmixConnection/VmixConnectionState";
import SaveSongMixin from "./SaveSongMixin";

export default {
  props: {
    source: String,
  },

  mixins: [SaveSongMixin],

  data: () => ({
    saveHover: false,

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

    shouldShowUnsavedChangesTooltip() {
      // return false;
      return this.hasUnsavedChanges && this.saveHover;
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

.middle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.row,
.container {
  max-height: 100%;
}

.v-footer {
  justify-content: space-between;
  font-size: 0.875em;
}

header,
footer {
  user-select: none;
}
</style>
