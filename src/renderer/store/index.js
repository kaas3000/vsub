import Vue from "vue";
import Vuex from "vuex";

import ElectronStore from "electron-store";

import VuexPersistence from "vuex-persist";

import modules from "./modules";

// Localstorage compatible adapter for electron-store
const ElectronStorage = {
  store: new ElectronStore(),

  getItem(key) {
    return this.store.get(key);
  },
  setItem(key, data) {
    this.store.set(key, data);
  },
  removeItem(key) {
    this.store.delete(key);
  },
  clear() {
    this.store.clear();
  },
  get length() {
    return this.store.length;
  },
};

// Migrate from vuex-electron to electron-store
(function migrateToElectronStore() {
  const oldStore = new ElectronStore({ name: "vuex" });
  if (oldStore.has("state")) {
    ElectronStorage.store.set("vuex.Settings", oldStore.get("state").Settings);
  }
})();

const vuexLocal = new VuexPersistence({
  storage: ElectronStorage,
  reducer: (state) => ({
    Settings: state.Settings,
  }),
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [
    // Keep the settings saved between application reloads
    vuexLocal.plugin,
  ],
  strict: process.env.NODE_ENV !== "production",
});
