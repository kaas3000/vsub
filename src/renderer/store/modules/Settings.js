import Vue from "vue";

const state = {
  vmixHost: "127.0.0.1",
  vmixInputName: "Ondertitels",
  vmixOverlay: 1,
  vmixTitleFieldAbove: "Headline.Text",
  vmixTitleFieldBelow: "Description.Text",
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
  SET_VMIX_TITLE_FIELD_ABOVE(state, name) {
    Vue.set(state, "vmixTitleFieldAbove", name);
  },
  SET_VMIX_TITLE_FIELD_BELOW(state, name) {
    Vue.set(state, "vmixTitleFieldBelow", name);
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
  setVmixTitleFieldAbove({ commit }, name) {
    commit("SET_VMIX_TITLE_FIELD_ABOVE", name);
  },
  setVmixTitleFieldBelow({ commit }, name) {
    commit("SET_VMIX_TITLE_FIELD_BELOW", name);
  },
};

export default {
  state,
  mutations,
  actions,
};
