<template>
  <v-row align="start" justify="center" class="h-100">
    <v-navigation-drawer permanent :width="350" app clipped>
      <span v-shortkey="['pageup']" @shortkey="previousSong()"></span>
      <span v-shortkey="['pagedown']" @shortkey="nextSong()"></span>
      <span v-shortkey="['enter']" @shortkey="selectVisibleSongSubtitles()"></span>

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
            </v-list-item-action>
            <v-list-item-action v-if="isEditingSongList" class="ml-0">
              <v-btn icon @click="$store.dispatch('removeSong', song)">
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-container>
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
    </v-navigation-drawer>

    <v-col class="h-100">
      <live-subtitle-list v-if="isLive && isEnabledFeatureLiveSubtitleView"></live-subtitle-list>
      <not-live-subtitle-list v-else></not-live-subtitle-list>
    </v-col>
  </v-row>
</template>

<script>
import EditSong from "./sidebar/EditSong";
import LiveSubtitleList from "./subtitleList/LiveSubtitleList";
import NotLiveSubtitleList from "./subtitleList/NotLiveSubtitleList";
import VmixConnectionState from "../vmixConnection/VmixConnectionState";
import { settingNames } from "../store/modules/Settings";

export default {
  components: {
    EditSong,
    LiveSubtitleList,
    NotLiveSubtitleList,
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

    isLive() {
      return this.$vMixConnection.connected === VmixConnectionState.LIVE;
    },

    isEnabledFeatureLiveSubtitleView() {
      return this.$store.state.Settings[settingNames.FEATURE_LIVE_SUBTITLE_VIEW];
    },
  },
  methods: {
    getSubtitles(songData) {
      if (songData) {
        return songData.subtitles;
      }
      return [];
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

<style scoped>
.main-column {
  max-height: 100%;
  overflow-y: auto;
}
</style>
