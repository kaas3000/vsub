<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          label="Positie in px van de lijn die de maximale lengte van de ondertitels hint bij het bewerken"
          type="number"
          v-model="widthHint"
        ></v-text-field>

        <v-text-field label="Lettertype van de ondertitels bij het bewerken" v-model="fontFamily"> </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import eventHub from "./../../EventHub";
import { settingNames } from "./../../store/modules/Settings";

export default {
  data() {
    return {
      widthHint: this.$store.state.Settings[settingNames.SUBTITLE_EDITOR_WIDTH_HINT],
      fontFamily: this.$store.state.Settings[settingNames.SUBTITLE_EDITOR_FONT_FAMILY],
    };
  },
  methods: {
    storeNewSettings() {
      this.$store.dispatch("updateSetting", {
        setting: settingNames.SUBTITLE_EDITOR_WIDTH_HINT,
        newValue: this.widthHint,
      });

      this.$store.dispatch("updateSetting", {
        setting: settingNames.SUBTITLE_EDITOR_FONT_FAMILY,
        newValue: this.fontFamily,
      });
    },
  },
  mounted() {
    eventHub.$on("save-settings", this.storeNewSettings);
  },
};
</script>
