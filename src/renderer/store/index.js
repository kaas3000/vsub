import Vue from "vue";
import Vuex from "vuex";

import { createPersistedState } from "vuex-electron";

import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [
    // Keep the settings saved between application reloads
    createPersistedState({
      whitelist: Object.getOwnPropertyNames(modules.Settings.mutations),
    }),
  ],
  strict: process.env.NODE_ENV !== "production",
});
