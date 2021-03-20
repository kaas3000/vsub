import Vue from "vue";

const maxFiles = 5;

const state = {
  currentFile: null,

  recentFiles: [],
};

const mutations = {
  SET_CURRENT_FILE(state, fileName) {
    Vue.set(state, "currentFile", fileName);

    if (fileName !== null) {
      Vue.set(state, "recentFiles", [
        fileName,
        ...state.recentFiles.filter((x) => x !== fileName).slice(0, maxFiles - 1),
      ]);
    }
  },
};

const actions = {
  setCurrentFile({ commit }, fileName) {
    commit("SET_CURRENT_FILE", fileName);
  },
};

export default {
  state,
  mutations,
  actions,
};
