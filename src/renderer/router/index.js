import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "landing-page",
      component: require("@/components/Baseline").default,
      children: [
        {
          path: "",
          name: "Startup welcome screen",
          component: require("@/components/welcome/WelcomeScreen").default,
        },
        {
          path: "present",
          name: "Present subtitles",
          component: require("@/components/PresentSubtitles").default,
        },
        {
          path: "settings",
          name: "Settings",
          component: require("@/components/settings/SettingsForm").default,
        },
      ],
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
