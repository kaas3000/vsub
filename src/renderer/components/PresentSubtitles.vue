<template>
  <v-row align="start" justify="center" style="height: 100%;">
    <v-col class="col-4 mh-100 overflow-auto">
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
                    type="number"
                    v-model="newSongLines"
                  ></v-textarea>
                  <v-row style="flex: 0 0 auto;">
                    <v-col>
                      <v-btn block @click="resetAddingSong">Annuleren</v-btn>
                    </v-col>
                    <v-col>
                      <v-btn block color="primary" @click="saveSong"
                        >Opslaan</v-btn
                      >
                    </v-col>
                  </v-row>
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
                      v-if="subtitles.type === 'divider'"
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
                        setSubtitles(subtitles.above, subtitles.below);
                        selectedSubtitle = [songData.title, i];
                      "
                    >
                      <v-list-item-content>
                        <span
                          v-if="subtitles.above === ''"
                          class="font-italic grey--text grey-darken-4--text"
                          >lege regel</span
                        >
                        {{ subtitles.above }}
                        <br />
                        <span
                          v-if="subtitles.below === ''"
                          class="font-italic grey--text grey-darken-4--text"
                          >lege regel</span
                        >
                        {{ subtitles.below }}
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
        return songData.subtitles;
      }
      return [];
    },
    saveSong() {
      const parsedSongLines = this.parseSongText(this.newSongLines);

      // When an old songtitle is set, the existing song has to be updated
      if (this.oldSongTitle !== "") {
        this.$store.dispatch("updateSong", {
          oldTitle: this.oldSongTitle,
          title: this.newSongTitle,
          subtitles: parsedSongLines,
        });

        // The old song title has been used, reset it
        this.oldSongTitle = "";

        // The song might load under a new title. Reset the subtitles.
        this.selectedSubtitle = [];
      } else {
        this.$store.dispatch("addSong", {
          title: this.newSongTitle,
          subtitles: parsedSongLines,
        });
      }

      this.resetAddingSong();
    },

    resetAddingSong() {
      this.newSongTitle = "";
      this.newSongLines = "";
      this.isAddingSong = false;
    },

    setSubtitles(above, below) {
      const aboveName = this.$store.state.Settings.vmixTitleFieldAbove;
      const belowName = this.$store.state.Settings.vmixTitleFieldBelow;

      this.execVmixCommands([
        {
          Function: "PauseRender",
          Input: this.$store.state.Settings.vmixInputName,
        },
        {
          Function: "SetText",
          Input: this.$store.state.Settings.vmixInputName,
          SelectedName: aboveName,
          Value: above,
        },
        {
          Function: "SetText",
          Input: this.$store.state.Settings.vmixInputName,
          SelectedName: belowName,
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
      this.oldSongTitle = title;
      this.newSongTitle = title;

      const songData = this.$store.state.Songs.songs[title];
      this.newSongLines = this.createSongText(songData);
    },

    createSongText(songData) {
      return songData.subtitles
        .filter(({ type }) => type === "subtitle")
        .map(({ above, below }) => `${above}\n${below}`)
        .join("\n")
        .trim();
    },
    parseSongText(songText) {
      const songLines = songText.split("\n");
      const subtitles = [];
      for (let i = 0; i < songLines.length; i += 2) {
        subtitles.push({
          type: "subtitle",
          above: songLines[i] || "",
          below: songLines[i + 1] || "",
        });
      }

      return subtitles;
    },

    previousSubtitle() {
      const [song = this.visibleSong, index = 0] = this.selectedSubtitle;
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
        this.setSubtitles(newSubtitles.above, newSubtitles.below);
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
      this.setSubtitles(newSubtitles.above, newSubtitles.below);
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
}
</style>
