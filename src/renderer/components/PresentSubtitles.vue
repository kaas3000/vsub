<template>
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
                <v-list-item v-for="(song, i) in songs" :key="i" :value="song">
                  <v-list-item-content>
                    {{ song }}
                  </v-list-item-content>

                  <v-list-item-action v-if="isEditingSongList">
                    <v-btn icon>
                      <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="$store.dispatch('removeSong', song)">
                      <v-icon color="grey lighten-1">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn tile text @click="isEditingSongList = !isEditingSongList"
              >Bewerkmodus</v-btn
            >
          </v-col>
          <v-col>
            <v-btn tile block @click="isAddingSong = !isAddingSong"
              >+ Nieuw lied</v-btn
            >
          </v-col>
        </v-row>
        <v-row v-if="isAddingSong">
          <v-col>
            <v-text-field v-model="newSongTitle" label="Titel"></v-text-field>
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
            <v-col>
              <v-row>
                <v-list dense class="col-12">
                  <template v-for="(subtitles, i) in subtitles">
                    <v-divider
                      v-if="subtitles === null"
                      :key="`${songData.title}-${i}`"
                    ></v-divider>

                    <v-list-item
                      v-else
                      :key="`${songData.title}-${i}`"
                      active-class="active"
                      :class="
                        `${songData.title}-${i}` === selectedSubtitle
                          ? 'active-subtitle'
                          : ''
                      "
                      @click="
                        setSubtitles(subtitles.boven, subtitles.onder);
                        selectedSubtitle = `${songData.title}-${i}`;
                      "
                    >
                      <v-list-item-content>
                        <span
                          v-if="subtitles.boven === ''"
                          class="font-italic grey--text grey-darken-4--text"
                          >lege regel</span
                        >
                        {{ subtitles.boven }}
                        <br />
                        <span
                          v-if="subtitles.onder === ''"
                          class="font-italic grey--text grey-darken-4--text"
                          >lege regel</span
                        >
                        {{ subtitles.onder }}
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    newSongTitle: "",
    newSongLines: "",

    // ui state
    isEditingSongList: false,
    isAddingSong: false,
    selectedSubtitle: null,
  }),
  computed: {
    songs() {
      return this.$store.getters.songTitles;
    },
    songData() {
      return this.$store.getters.songData;
    },

    visibleSong: {
      get() {
        return this.$store.visibleSong;
      },
      set(title) {
        return this.$store.dispatch("setVisibleSong", title);
      },
    },

    subtitles() {
      if (this.songData) {
        return this.songData.verses.reduce((acc, verse) => {
          return [...acc, null, ...verse.regels];
        }, []);
      }
      return [];
    },
  },
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
        {
          Function: "PauseRender",
          Input: this.$store.state.Settings.vmixInputName,
        },
        {
          Function: "SetText",
          Input: this.$store.state.Settings.vmixInputName,
          SelectedName: "Headline.Text",
          Value: above,
        },
        {
          Function: "SetText",
          Input: this.$store.state.Settings.vmixInputName,
          SelectedName: "Description.Text",
          Value: below,
        },
        {
          Function: "ResumeRender",
          Input: this.$store.state.Settings.vmixInputName,
        },
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
.active-subtitle {
  &::before {
    background-color: currentColor;
    bottom: 0;
    content: "";
    left: 0;
    opacity: 0.1;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }
}
</style>
