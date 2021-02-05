<template>
  <v-container>
    <v-row>
      <v-col>
        <v-switch
          label="Live subtitle weergave"
          hint="Wissel naar een aangepaste weergave op het moment dat ondertitels live gepresenteerd worden"
          persistent-hint
          v-model="isEnabledFeatureLiveSubtitleView"
        ></v-switch>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-switch
          label="Houd actieve regel in beeld"
          hint="Wanneer een ondertitel-regel wordt geselecteerd wordt deze automatisch in beeld gescrolld"
          persistent-hint
          v-model="isEnabledFeatureActiveSubtitleVisible"
        ></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import eventHub from "../../EventHub";
import { settingNames } from "../../store/modules/Settings";

export default {
  data() {
    return {
      isEnabledFeatureLiveSubtitleView: this.$store.state.Settings[settingNames.FEATURE_LIVE_SUBTITLE_VIEW],
      isEnabledFeatureActiveSubtitleVisible: this.$store.state.Settings[
        settingNames.FEATURE_KEEP_ACTIVE_SUBTITLE_VISIBLE
      ],
    };
  },
  methods: {
    storeNewSettings() {
      this.$store.dispatch("updateSetting", {
        setting: settingNames.FEATURE_LIVE_SUBTITLE_VIEW,
        newValue: this.isEnabledFeatureLiveSubtitleView,
      });
      this.$store.dispatch("updateSetting", {
        setting: settingNames.FEATURE_KEEP_ACTIVE_SUBTITLE_VISIBLE,
        newValue: this.isEnabledFeatureActiveSubtitleVisible,
      });
    },
  },
  mounted() {
    eventHub.$on("save-settings", this.storeNewSettings);
  },
};
</script>
