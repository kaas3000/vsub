import Vue from "vue";

const state = {
  vmixAddress: null,

  visibleSong: "Psalm 1",
  activeSubtitle: null,
  songs: {},
};

const mutations = {
  SET_ACTIVE_SUBTITLE(state, { songTitle, index }) {
    state.activeSubtitle = { songTitle, index };
  },

  ADD_SONG(state, { title, subtitles = [] }) {
    Vue.set(state.songs, title, {
      title,
      subtitles,
    });
  },

  UPDATE_SONG(state, { oldTitle, title, subtitles }) {
    if (state.songs[oldTitle] && oldTitle !== title) {
      Vue.delete(state.songs, oldTitle);
    }

    Vue.set(state.songs, title, {
      title,
      subtitles,
    });

    Vue.set(state, "visibleSong", title);
  },

  REMOVE_SONG(state, title) {
    Vue.delete(state.songs, title);
  },

  CLEAR_ALL_SONGS(state) {
    Vue.set(state, "songs", {});
  },

  LOAD_SONGS(state, songs) {
    Vue.set(state, "songs", songs);
  },

  SET_VISIBLE_SONG(state, title) {
    Vue.set(state, "visibleSong", title);
  },
};

const actions = {
  addSong(store, args) {
    // do something async
    store.commit("ADD_SONG", args);
  },

  updateSong(store, args) {
    store.commit("UPDATE_SONG", args);
  },

  clearSongs(store) {
    store.commit("CLEAR_ALL_SONGS");
  },

  loadSongs(store, args) {
    store.commit("LOAD_SONGS", args);
  },

  removeSong(store, title) {
    store.commit("REMOVE_SONG", title);
  },

  setVisibleSong({ commit }, title) {
    commit("SET_VISIBLE_SONG", title);
  },

  setActiveSubtitle({ commit }, { songTitle, index }) {
    commit("SET_ACTIVE_SUBTITLE", { songTitle, index });
  },
};

const getters = {
  songTitles: (state) => Object.keys(state.songs),

  songData: (state) => {
    const emptySubtitle = {
      above: "",
      below: "",
    };
    const visibleSongData = { ...state.songs[state.visibleSong] };

    visibleSongData.subtitles = [emptySubtitle, ...visibleSongData.subtitles, emptySubtitle];

    return visibleSongData;
  },

  selectedSong: (state) => Object.values(state.songs).find((song) => song.regels.find((regel) => regel.active === true)),

  songJson: (state, getters) => {
    const { selectedSong } = getters;
    if (selectedSong) {
      return selectedSong.regels.map(({ boven, onder }) => ({
        boven,
        onder,
      }));
    }
    return [];
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
