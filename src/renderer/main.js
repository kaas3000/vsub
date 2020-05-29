import Vue from "vue";
import axios from "axios";
import { ipcRenderer } from "electron";

import Vuetify from "vuetify";
import "@mdi/font/css/materialdesignicons.min.css";
import "vuetify/dist/vuetify.min.css";
import VueShortKey from "vue-shortkey";

import App from "./App";
import router from "./router";
import store from "./store";
import vMixConnectionPlugin, {
  VMixConnectionPluginStore,
} from "./plugins/vmix-connection";

Vue.use(Vuetify);
Vue.use(vMixConnectionPlugin, new VMixConnectionPluginStore());
Vue.use(VueShortKey, { prevent: ["input", "textarea"] });

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
  vuetify: new Vuetify({}),
}).$mount("#app");

ipcRenderer.on("song-subtitles-req", () => {
  ipcRenderer.send("song-subtitles-resp", store.getters.songJson);
});
