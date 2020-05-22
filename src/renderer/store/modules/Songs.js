import Vue from "vue";
const emptySubTitle = { active: false, boven: "", onder: "" };
function isEmptySubtitle(subTitle) {
  if ("active" in subTitle && "boven" in subTitle && "onder" in subTitle) {
    return (
      subTitle.active === emptySubTitle.active &&
      subTitle.boven === emptySubTitle.boven &&
      subTitle.onder === emptySubTitle.onder
    );
  }
  return false;
}

const state = {
  vmixAddress: null,
  active: null,

  visibleSong: "Psalm 1",
  songs: {
    "Psalm 1": {
      title: "Psalm 1",
      regels: [
        { ...emptySubTitle },
        {
          active: false,
          boven: "Regel boven",
          onder: "regel onderaan",
        },
        {
          active: false,
          boven: "Regel 2 boven",
          onder: "Regel 2",
        },
      ],
    },
  },
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

  ADD_SONG(state, { title, regels = [] }) {
    if (!isEmptySubtitle(regels[0] || {})) {
      regels = [{ ...emptySubTitle }, ...regels];
    }

    Vue.set(state.songs, title, {
      title,
      regels,
    });
  },

  REMOVE_SONG(state, title) {
    delete state.songs[title];
  },

  CLEAR_ALL_SONGS(state) {
    Vue.set(state, "songs", {});
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

  clearSongs(store) {
    store.commit("CLEAR_ALL_SONGS");
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
