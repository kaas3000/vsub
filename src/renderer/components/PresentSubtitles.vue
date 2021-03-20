<template>
  <v-row align="start" justify="center" class="h-100">
    <v-navigation-drawer permanent :width="350" app clipped>
      <span v-if="isAllowedChangeSong" v-shortkey="['pageup']" @shortkey="previousSong()"></span>
      <span v-if="isAllowedChangeSong" v-shortkey="['pagedown']" @shortkey="nextSong()"></span>

      <v-list nav :disabled="!isAllowedChangeSong">
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
      <subtitle-list></subtitle-list>
    </v-col>
  </v-row>
</template>

<script>
import EditSong from "./sidebar/EditSong";
import SubtitleList from "./subtitleList/SubtitleList";
import VmixConnectionState from "../vmixConnection/VmixConnectionState";

export default {
  components: {
    EditSong,
    SubtitleList,
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

    visibleSong: {
      get() {
        return this.$store.state.Songs.visibleSong;
      },
      set(title) {
        this.$store.dispatch(
          "setActiveSubtitle",
          title
            ? {
                songTitle: title,
                index: 0,
              }
            : null
        );
        return this.$store.dispatch("setVisibleSong", title);
      },
    },

    isLive() {
      return this.$vMixConnection.connected === VmixConnectionState.LIVE;
    },

    isAllowedChangeSong() {
      return this.$vMixConnection.connected !== VmixConnectionState.LIVE;
    },
  },
  methods: {
    cancelEditSongPopup() {
      this.isAddingSong = false;
      this.editSongCurrentlyEditingTitle = null;
    },

    editSong(title) {
      this.editSongCurrentlyEditingTitle = title;
      this.isAddingSong = true;
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

  mounted() {
    if (this.songs.length === 0) {
      this.isEditingSongList = true;
      this.isAddingSong = true;
    }
  },
};
</script>

<style scoped>
.main-column {
  max-height: 100%;
  overflow-y: auto;
}
</style>
