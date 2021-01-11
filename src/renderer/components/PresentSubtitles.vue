<template>
  <v-row align="start" justify="center" style="height: 100%;">
    <v-col class="col-4 mh-100 overflow-auto">
      <v-container class="fill-height" fluid>
        <span v-shortkey="['arrowup']" @shortkey="previousSubtitle()"></span>
        <span v-shortkey="['arrowdown']" @shortkey="nextSubtitle()"></span>
        <span v-shortkey="['pageup']" @shortkey="previousSong()"></span>
        <span v-shortkey="['pagedown']" @shortkey="nextSong()"></span>
        <span v-shortkey="['enter']" @shortkey="selectVisibleSongSubtitles()"></span>
        <v-row>
          <v-col>
            <v-list nav>
              <v-subheader>Liederen</v-subheader>
              <v-list-item-group mandatory v-model="visibleSong" color="primary">
                <v-list-item v-for="(song, i) in songs" :key="i" :value="song">
                  <v-list-item-content>
                    {{ song }}
                  </v-list-item-content>

                  <v-list-item-action v-if="isEditingSongList">
                    <v-btn icon>
                      <v-icon color="grey lighten-1" @click="editSong(song)">mdi-pencil</v-icon>
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
            <v-btn tile text @click="isEditingSongList = !isEditingSongList">Bewerkmodus</v-btn>
          </v-col>
          <v-col>
            <v-btn tile block @click="isAddingSong = true">+ Nieuw Lied</v-btn>
            <edit-song
              :isVisible="isAddingSong"
              :currentlyEditingSongTitle="editSongCurrentlyEditingTitle"
              @cancel="cancelEditSongPopup"
            ></edit-song>
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
                  <!-- The first subtitles should always be empty -->
                  <v-list-item
                    :class="(selectedSubtitle == false ? 'active-subtitle' : '') + 'pa-0'"
                    :ref="selectedSubtitle == false ? 'activeSubtitle' : ''"
                    @click="
                      setSubtitles('', '');
                      selectedSubtitle = [];
                    "
                  >
                    <v-list-item-icon style="align-self: center;">
                      <v-icon large>{{ selectedSubtitle == false ? "mdi-arrow-right" : "" }}</v-icon>
                    </v-list-item-icon>
                    <v-card flat width="100%" tile :outlined="selectedSubtitle == false">
                      <v-list-item-content class="px-2">
                        <span
                          :class="
                            selectedSubtitle == false
                              ? 'font-italic white--text white-lighten-2--text'
                              : 'font-italic grey--text grey-darken-4--text'
                          "
                          >lege regel</span
                        ><br />
                        <span
                          :class="
                            selectedSubtitle == false
                              ? 'font-italic white--text white-lighten-2--text'
                              : 'font-italic grey--text grey-darken-4--text'
                          "
                          >lege regel</span
                        >
                      </v-list-item-content>
                    </v-card>
                  </v-list-item>

                  <template v-for="(subtitles, i) in subtitles">
                    <v-divider v-if="subtitles.type === 'divider'" :key="`${songData.title}-${i}`"></v-divider>

                    <v-list-item
                      color="primary"
                      v-else
                      :key="`${songData.title}-${i}`"
                      active-class="active"
                      :class="
                        [songData.title, i].toString() === selectedSubtitle.toString()
                          ? 'pa-0 active-subtitle'
                          : 'pa-0 '
                      "
                      :ref="[songData.title, i].toString() === selectedSubtitle.toString() ? 'activeSubtitle' : ''"
                      @click="
                        setSubtitles(subtitles.above, subtitles.below);
                        selectedSubtitle = [songData.title, i];
                      "
                    >
                      <v-card
                        flat
                        :color="
                          [songData.title, i].toString() === selectedSubtitle.toString()
                            ? 'green white--text'
                            : 'transparent'
                        "
                        width="100%"
                        tile
                      >
                        <v-list-item-content class="px-2">
                          <span v-if="subtitles.above === ''" class="font-italic grey--text grey-darken-4--text"
                            >lege regel</span
                          >
                          <span v-else> {{ subtitles.above }} </span>
                          <br />
                          <span v-if="subtitles.below === ''" class="font-italic grey--text grey-darken-4--text"
                            >lege regel</span
                          >
                          <span v-else> {{ subtitles.below }} </span>
                        </v-list-item-content>
                      </v-card>
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
import EditSong from "./sidebar/EditSong";

export default {
  components: {
    EditSong,
  },
  data: () => ({
    editSongCurrentlyEditingTitle: null,

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

    cancelEditSongPopup() {
      this.isAddingSong = false;
      this.editSongCurrentlyEditingTitle = null;
    },

    editSong(title) {
      this.editSongCurrentlyEditingTitle = title;
      this.isAddingSong = true;
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

      this.$refs.activeSubtitle[0].$el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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

      this.$refs.activeSubtitle[0].$el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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
}
</style>

<style lang="scss">
.addSong {
  height: 100%;
}

.subtitleWidthHint {
  position: absolute;
  height: calc(100% - 3em);
  top: 1em;
  border-right: 1px solid #ff0000;
}
</style>
