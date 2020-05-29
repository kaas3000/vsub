<template>
  <v-row align="start" justify="center" style="height: 100%;">
    <v-col class="col-4">
      <v-container class="fill-height" fluid>
        <span v-shortkey="['arrowup']" @shortkey="previousSubtitle()"></span>
        <span v-shortkey="['arrowdown']" @shortkey="nextSubtitle()"></span>
        <span v-shortkey="['pageup']" @shortkey="previousSong()"></span>
        <span v-shortkey="['pagedown']" @shortkey="nextSong()"></span>
        <span
          v-shortkey="['enter']"
          @shortkey="selectVisibleSongSubtitles()"
        ></span>
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
                      <v-icon color="grey lighten-1" @click="editSong(song)"
                        >mdi-pencil</v-icon
                      >
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
            <v-dialog
              v-model="isAddingSong"
              content-class="addSong"
              @input="handleEditSongPopup"
            >
              <template v-slot:activator="{ on }">
                <v-btn tile block v-on="on">+ Nieuw Lied</v-btn>
              </template>

              <v-card class="d-flex flex-column h-100">
                <v-card-title>Ondertitels bewerken</v-card-title>
                <v-container fluid class="h-100 d-flex flex-column">
                  <v-text-field
                    style="flex: 0 0 auto;"
                    v-model="newSongTitle"
                    label="Titel"
                  ></v-text-field>
                  <v-textarea
                    outlined
                    style="flex: 1 1 auto; overflow: auto; padding-top: 1em;"
                    auto-grow
                    label="Tekstregels"
                    v-model="newSongLines"
                  ></v-textarea>
                  <v-btn style="flex: 0 0 auto;" id="Opslaan" @click="saveSong"
                    >Opslaan</v-btn
                  >
                </v-container>
              </v-card>
            </v-dialog>
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
                  <v-list-item
                    :class="selectedSubtitle == false ? 'active-subtitle' : ''"
                    @click="
                      setSubtitles('', '');
                      selectedSubtitle = [];
                    "
                    ><v-list-item-content>
                      <span class="font-italic grey--text grey-darken-4--text"
                        >lege regel</span
                      ><br />
                      <span class="font-italic grey--text grey-darken-4--text"
                        >lege regel</span
                      >
                    </v-list-item-content>
                  </v-list-item>

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
                        [songData.title, i].toString() ===
                        selectedSubtitle.toString()
                          ? 'active-subtitle'
                          : ''
                      "
                      @click="
                        setSubtitles(subtitles.boven, subtitles.onder);
                        selectedSubtitle = [songData.title, i];
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
    oldSongTitle: "",
    newSongTitle: "",
    newSongLines: "",

    // ui state
    isEditingSongList: false,
    isAddingSong: false,
    selectedSubtitle: [],
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
        return this.$store.state.Songs.visibleSong;
      },
      set(title) {
        return this.$store.dispatch("setVisibleSong", title);
      },
    },

    subtitles() {
      return this.getSubtitles(this.songData);
    },
  },
  methods: {
    getSubtitles(songData) {
      if (songData) {
        return songData.verses.reduce((acc, verse) => {
          return [...acc, null, ...verse.regels];
        }, []);
      }
      return [];
    },
    saveSong() {
      const parsedSongLines = this.parseSongText(this.newSongLines);

      // When an old songtitle is set, the existing song has to be updated
      if (this.oldSongTitle !== "") {
        this.store.dispatch("updateSong", {
          oldTitle: this.oldSongTitle,
          title: this.newSongTitle,
          verses: parsedSongLines,
        });

        // The old song title has been used, reset it
        this.oldSongTitle = "";
      } else {
        this.$store.dispatch("addSong", {
          title: this.newSongTitle,
          verses: parsedSongLines,
        });
      }

      this.newSongTitle = "";
      this.newSongLines = "";
      this.isAddingSong = false;
    },

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

    handleEditSongPopup(isOpen) {
      if (isOpen === false) {
        this.oldSongTitle = "";
        this.newSongTitle = "";
        this.newSongLines = "";
      }
    },

    editSong(title) {
      this.isAddingSong = true;
      this.oldSongTitle = "";
      this.newSongTitle = title;

      const songData = this.$store.state.Songs.songs[title];
      this.newSongLines = this.createSongText(songData);
    },

    createSongText(songData) {
      return songData.verses
        .map((verse) => {
          return verse.regels
            .map(({ boven, onder }) => `${boven}\n${onder}`)
            .join("\n\n");
        })
        .join("\n\n\n");
    },
    parseSongText(songText) {
      const parseSubtitle = (subtitle) => {
        // A single newline seperates two textlines in one subtitle
        const lines = subtitle.split("\n");

        // Parse the subtitle line and normalize the output
        if (lines.length === 1) {
          return { boven: "", onder: lines[0] };
        }
        if (lines.length > 1) {
          return { boven: lines[0], onder: lines[1] };
        }
        return { boven: "", onder: "" };
      };
      const parseVerse = (verse) => ({
        regels: verse
          // A double newline seperates different subtitles
          .split("\n\n")
          .map(parseSubtitle),
      });

      // A triple newline seperates the verses
      return songText.split("\n\n\n").map((verse) => parseVerse(verse));
    },

    previousSubtitle() {
      const [song = this.visibleSong, index = 1] = this.selectedSubtitle;
      const subtitles = this.getSubtitles(this.$store.state.Songs.songs[song]);

      let newIndex = index - 1;
      if (subtitles[newIndex] === null) {
        newIndex -= 1;
      }
      if (newIndex < 0) {
        this.selectedSubtitle = [];
        this.setSubtitles("", "");
      } else {
        this.selectedSubtitle = [song, newIndex];
        const newSubtitles = subtitles[newIndex];
        this.setSubtitles(newSubtitles.boven, newSubtitles.onder);
      }
    },
    nextSubtitle() {
      const [song = this.visibleSong, index = -1] = this.selectedSubtitle;
      const subtitles = this.getSubtitles(this.$store.state.Songs.songs[song]);

      // Start with simply increasing the index
      let newIndex = index + 1;
      // Don't increase when the last subtitle is selected
      if (newIndex > subtitles.length - 1) {
        newIndex = subtitles.length - 1;
      }
      // null-subtitles are rendered as a line (to seperate verses)
      if (subtitles[newIndex] === null) {
        newIndex += 1;
      }

      this.selectedSubtitle = [song, newIndex];

      const newSubtitles = subtitles[newIndex];
      this.setSubtitles(newSubtitles.boven, newSubtitles.onder);
    },

    selectVisibleSongSubtitles() {
      this.selectedSubtitle = [];
      this.setSubtitles("", "");
    },

    nextSong() {
      const { songs } = this;

      const index = songs.indexOf(this.visibleSong);
      const newIndex = Math.min(index + 1, songs.length - 1);

      this.visibleSong = songs[newIndex];
    },
    previousSong() {
      const { songs } = this;

      const index = songs.indexOf(this.visibleSong);
      const newIndex = Math.max(index - 1, 0);

      this.visibleSong = songs[newIndex];
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

<style lang="scss">
.addSong {
  height: 100%;

  .h-100 {
    height: 100%;
  }
}
</style>
