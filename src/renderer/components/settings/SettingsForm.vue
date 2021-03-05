<template>
  <v-container class="d-flex">
    <v-card class="settings-card">
      <v-card-title>
        Settings
      </v-card-title>
      <v-card-text>
        <v-tabs>
          <v-tab>VMix</v-tab>
          <v-tab-item>
            <vmix-settings></vmix-settings>
          </v-tab-item>

          <v-tab>Subtitle editor</v-tab>
          <v-tab-item>
            <subtitle-editor-settings></subtitle-editor-settings>
          </v-tab-item>

          <v-tab>Experimentele features</v-tab>
          <v-tab-item>
            <experimental-features-settings></experimental-features-settings>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn text @click="$router.back()">Annuleren</v-btn>
        <v-btn
          text
          color="primary"
          @click="
            storeNewSettings();
            $router.back();
          "
          >Opslaan</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import eventHub from "../../EventHub";
import VMixSettings from "./VMixSettings";
import SubtitleEditorSettings from "./SubtitleEditorSettings";
import ExperimentalFeaturesSettings from "./ExperimentalFeaturesSettings";

export default {
  components: {
    "vmix-settings": VMixSettings,
    SubtitleEditorSettings,
    ExperimentalFeaturesSettings,
  },
  data() {
    return {};
  },

  methods: {
    storeNewSettings() {
      eventHub.$emit("save-settings");
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.settings-card {
  display: flex;
  flex-direction: column;
  flex: 1;

  > .v-card__text {
    overflow-y: auto;
  }
}
</style>
