<template>
  <v-app id="inspire">
    <v-app-bar app :color="accentColor" dark>
      <v-toolbar-title>GKV Lied Ondertiteling</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="toggleLive()"
        ref="toggleLiveButton"
        :loading="isLiveTransitioning"
      >
        <v-icon>{{ isLive ? "mdi-stop" : "mdi-play" }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="start" justify="center" style="height: 100%;">
          <v-col class="col-4">
            <v-container class="fill-height" fluid>
              <v-row>
                <v-col>
                  <v-list>
                    <v-subheader>Liederen</v-subheader>
                    <v-list-item-group
                      mandatory
                      v-model="visibleSong"
                      color="primary"
                    >
                      <v-list-item
                        v-for="(song, i) in songs"
                        :key="i"
                        :value="song"
                        >{{ song }}
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-btn
                    tile
                    block
                    id="add"
                    @click="isAddingSong = !isAddingSong"
                    >+ Nieuw lied</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-if="isAddingSong">
                <v-col>
                  <v-text-field
                    v-model="newSongTitle"
                    label="Titel"
                  ></v-text-field>
                  <v-textarea
                    outlined
                    label="Tekstregels"
                    v-model="newSongLines"
                  ></v-textarea>
                  <v-btn
                    id="Opslaan"
                    @click="
                      saveSong();
                      isAddingSong = !isAddingSong;
                    "
                    >Opslaan</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-col>

          <v-col class="col-8 overflow-y">
            <v-row>
              <v-container>
                <v-row dense>
                  <v-col
                    v-for="(regels, i) in songData ? songData.regels : []"
                    :key="i"
                    cols="12"
                  >
                    <v-card
                      flat
                      :class="
                        regels.active
                          ? 'font-weight-bold primary--text active'
                          : null
                      "
                      @click="setSubtitles(regels.boven, regels.onder)"
                    >
                      <div>
                        <v-card-text class="py-0">
                          <span
                            v-if="regels.boven === ''"
                            class="font-italic grey--text grey-darken-4--text"
                            >lege regel</span
                          >
                          {{ regels.boven }}
                          <br />
                          <span
                            v-if="regels.onder === ''"
                            class="font-italic grey--text grey-darken-4--text"
                            >lege regel</span
                          >
                          {{ regels.onder }}
                        </v-card-text>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-row>
          </v-col>
        </v-row>
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
    isLive: false,
    // isVmixConnected: false,
    isLiveTransitioning: false,
    ip: ip.address(),

    isAddingSong: true,
    newSongTitle: "",
    newSongLines: "",

    vmixHost: "127.0.0.1",
    vmixBaseUrl: `http://127.0.0.1:8088`,
    vmixInputName: "Ondertitels",
    vmixInputIndex: null,
    vmixDataSourceInput: "krakaka",
    vmixOverlay: 1,
  }),

  methods: {
    saveSong() {
      const parsedSongLines = this.newSongLines
        .split("\n\n")
        .map((lines) => lines.split("\n"))
        .map((lines) => {
          if (lines.length === 1) {
            return { boven: "", onder: lines[0] };
          }
          if (lines.length > 1) {
            return { boven: lines[0], onder: lines[1] };
          }
          return { boven: "", onder: "" };
        })
        .filter((val) => val !== null);

      this.$store.dispatch("addSong", {
        title: this.newSongTitle,
        regels: parsedSongLines,
      });
    },

    /**
     * @param {string} above
     * @param {string} below
     */
    setSubtitles(above, below) {
      this.execVmixCommands([
        { Function: "PauseRender", Input: this.vmixInputName },
        {
          Function: "SetText",
          Input: this.vmixInputName,
          SelectedName: "Headline.Text",
          Value: above,
        },
        {
          Function: "SetText",
          Input: this.vmixInputName,
          SelectedName: "Description.Text",
          Value: below,
        },
        { Function: "ResumeRender", Input: this.vmixInputName },
      ]);
    },

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
        Function: `OverlayInput${this.vmixOverlay}In`,
        Input: this.vmixInputName,
      });
    },

    disableLive() {
      this.isLiveTransitioning = true;
      this.execVmixCommands({
        Function: `OverlayInput${this.vmixOverlay}Out`,
        Input: this.vmixInputName,
      });
    },

    toggleLive() {
      if (this.isLive) {
        this.disableLive();
      } else {
        this.enableLive();
      }
    },

    setSubtitleInputIndexFromState(xml) {
      const xmlDocument = new DOMParser().parseFromString(xml, "text/xml");

      // Query the input number from the xml document using xpath
      const xpathResult = xmlDocument.evaluate(
        `/vmix/inputs//input[@title="${this.vmixInputName}"]/@number`,
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

  computed: {
    accentColor() {
      if (!this.isVmixConnected) return "secondary";
      if (this.isLive) return "orange";
      return "primary";
    },
    songs() {
      return this.$store.getters.songTitles;
    },
    songData() {
      return this.$store.getters.songData;
    },
    isVmixConnected() {
      return this.$vMixConnection.connected;
    },
    visibleSong: {
      get() {
        return this.$store.visibleSong;
      },
      set(title) {
        return this.$store.dispatch("setVisibleSong", title);
      },
    },
  },

  mounted() {
    this.setVmixConnection(this.vmixHost, { autoReconnect: true });

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
