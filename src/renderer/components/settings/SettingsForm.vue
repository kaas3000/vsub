<template>
  <v-container>
    <v-card class="overflow-y" height="100%">
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
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary lighten-2" text to="/">Annuleren</v-btn>
        <v-btn
          color="primary"
          depressed
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
import eventHub from "./../../EventHub";
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

<style></style>
