import Vue from "vue";

/**
 * @param {String[]} titles
 * @returns {String[]}
 */
function sortSongTitles(titles) {
  return titles.sort((a, b) => a.localeCompare(b));
}

const state = {
  visibleSong: "Psalm 1",
  activeSubtitle: null,
  songs: {},

  hasChangedSinceLastSave: false,
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

    state.hasChangedSinceLastSave = true;
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
    state.hasChangedSinceLastSave = true;
  },

  REMOVE_SONG(state, title) {
    Vue.delete(state.songs, title);

    state.hasChangedSinceLastSave = true;
  },

  CLEAR_ALL_SONGS(state) {
    Vue.set(state, "songs", {});
  },

  LOAD_SONGS(state, songs) {
    Vue.set(state, "songs", songs);
    const firstSongTitle = sortSongTitles(Object.keys(songs))[0];
    Vue.set(state, "activeSubtitle", {
      songTitle: firstSongTitle,
      index: 0,
    });

    Vue.set(state, "hasChangedSinceLastSave", false);
  },

  SET_VISIBLE_SONG(state, title) {
    Vue.set(state, "visibleSong", title);
  },

  SET_CHANGED_SINCE_LAST_SAVE(state, hasChanged) {
    state.hasChangedSinceLastSave = hasChanged;
  },
};

const actions = {
  addSong(store, args) {
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

  setChangedSinceLastSave({ commit }, hasChanged) {
    commit("SET_CHANGED_SINCE_LAST_SAVE", hasChanged);
  },

  clearSession({ commit }) {
    commit("CLEAR_ALL_SONGS");
    commit("SET_CURRENT_FILE", null); // defined in SaveFiles store
  },
};

const getters = {
  songTitles: (state) => {
    const songTitles = Object.keys(state.songs);
    const sortedSongTitles = sortSongTitles(songTitles);

    return sortedSongTitles;
  },

  songData: (state) => {
    const emptySubtitle = {
      above: "",
      below: "",
    };

    if (!Object.prototype.hasOwnProperty.call(state.songs, state.visibleSong)) {
      return null;
    }

    const visibleSongData = { ...state.songs[state.visibleSong] };

    visibleSongData.subtitles = [emptySubtitle, ...visibleSongData.subtitles, emptySubtitle];

    return visibleSongData;
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
