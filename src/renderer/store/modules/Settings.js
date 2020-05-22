import Vue from "vue";

const state = {
  vmixHost: "127.0.0.1",
  vmixInputName: "Ondertitels",
  vmixOverlay: 1,
};

const mutations = {
  SET_VMIX_HOST(state, newHost) {
    Vue.set(state, "vmixHost", newHost);
  },
  SET_VMIX_INPUT_NAME(state, newInputName) {
    Vue.set(state, "vmixInputName", newInputName);
  },
  SET_VMIX_OVERLAY(state, newOverlay) {
    Vue.set(state, "vmixOverlay", newOverlay);
  },
};

const actions = {
  setVmixHost({ commit }, newHost) {
    commit("SET_VMIX_HOST", newHost);
  },
  setVmixInputName({ commit }, newInputName) {
    commit("SET_VMIX_INPUT_NAME", newInputName);
  },
  setVmixOverlay({ commit }, newOverlay) {
    commit("SET_VMIX_OVERLAY", newOverlay);
  },
};

export default {
  state,
  mutations,
  actions,
};
