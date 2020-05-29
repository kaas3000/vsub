import Vue from "vue";

const state = {
  vmixAddress: null,
  active: null,

  visibleSong: "Psalm 1",
  songs: {},
};

const mutations = {
  SET_ACTIVE(state, { songTitle, regelIndex }) {
    state.songs[state.active.songTitle].regels[state.active.regelIndex] = false;

    state.songs[songTitle].regels[regelIndex].active = true;

    if (state.active) {
      state.active = {
        songTitle,
        regelIndex,
      };
    }
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

  SELECT_SUBTITLE(state, i) {
    Object.values(state.songs).forEach((song) => {
      song.regels.forEach((regel) => {
        if (regel.active) {
          Vue.set(regel, "active", false);
        }
      });
    });

    const visibleSong = state.songs[state.visibleSong];
    Vue.set(visibleSong.regels[i], "active", true);
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

  selectSubtitle({ commit }, i) {
    commit("SELECT_SUBTITLE", i);
  },
};

const getters = {
  songTitles: (state) => Object.keys(state.songs),

  songData: (state) => state.songs[state.visibleSong],

  selectedSong: (state) => {
    return Object.values(state.songs).find((song) => {
      return song.regels.find((regel) => regel.active === true);
    });
  },

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
