import Vue from "vue";

const settingNames = {
  VMIX_HOST: "vmixHost",
  VMIX_INPUT_NAME: "vmixInputName",
  VMIX_OVERLAY: "vmixOverlay",
  VMIX_TITLE_FIELD_ABOVE: "vmixTitleFieldAbove",
  VMIX_TITLE_FIELD_BELOW: "vmixTitleFieldBelow",

  SUBTITLE_EDITOR_WIDTH_HINT: "subtitleEditorWidthHint",
  SUBTITLE_EDITOR_FONT_FAMILY: "subtitleEditorFontFamily",

  FEATURE_LIVE_SUBTITLE_VIEW: "featureLiveSubtitleView",
  FEATURE_KEEP_ACTIVE_SUBTITLE_VISIBLE: "featureKeepActiveSubtitleVisible",
};

const state = {
  [settingNames.VMIX_HOST]: "127.0.0.1",
  [settingNames.VMIX_INPUT_NAME]: "Ondertitels",
  [settingNames.VMIX_OVERLAY]: 1,
  [settingNames.VMIX_TITLE_FIELD_ABOVE]: "Headline.Text",
  [settingNames.VMIX_TITLE_FIELD_BELOW]: "Description.Text",

  [settingNames.SUBTITLE_EDITOR_WIDTH_HINT]: 300,
  [settingNames.SUBTITLE_EDITOR_FONT_FAMILY]: "Roboto",

  [settingNames.FEATURE_LIVE_SUBTITLE_VIEW]: false,
  [settingNames.FEATURE_KEEP_ACTIVE_SUBTITLE_VISIBLE]: false,
};

const mutations = {
  UPDATE_SETTING(state, { setting, newValue }) {
    Vue.set(state, setting, newValue);
  },
};

const actions = {
  updateSetting({ commit }, { setting, newValue }) {
    commit("UPDATE_SETTING", { setting, newValue });
  },
};

export { settingNames };

export default {
  state,
  mutations,
  actions,
};
