<template>
  <v-container class="overflow-y">
    <v-row>
      <v-col>
        <v-text-field
          label="vMix IP addres"
          v-model="vmisAddress"
          hint="Voer hier het IP addres, of de hostname, in van de computer waar vMix op draait"
          persistent-hint
          @blur="loadVmixInputNames"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-combobox
          label="vMix ondertitel input"
          :items="vmixInputNames"
          v-model="inputName"
          hint="Kies de vMix input voor de ondertiteling"
          persistent-hint
        >
        </v-combobox>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn-toggle mandatory v-model="overlay">
          <v-btn value="1">1</v-btn>
          <v-btn value="2">2</v-btn>
          <v-btn value="3">3</v-btn>
          <v-btn value="4">4</v-btn>
        </v-btn-toggle>
        <div>
          <small>
            Kies de overlay knop waar de ondertitels mee geactiveerd worden
          </small>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field
          label="vMix Title Editor naam boven"
          v-model="vmixTitleFieldAbove"
          hint="Voer hier de naam in die de bovenste ondertitel-regel heeft in de vMix Title Editor"
          persistent-hint
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="vMix Title Editor naam onder"
          v-model="vmixTitleFieldBelow"
          hint="En voer hier de naam in van de onderste regel"
          persistent-hint
        ></v-text-field
      ></v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import eventHub from "../../EventHub";
import { settingNames } from "../../store/modules/Settings";

export default {
  data() {
    return {
      vmisAddress: this.$store.state.Settings.vmixHost,
      inputName: this.$store.state.Settings.vmixInputName,
      overlay: this.$store.state.Settings.vmixOverlay,

      vmixInputNames: [],
      vmixTitleFieldAbove: this.$store.state.Settings.vmixTitleFieldAbove,
      vmixTitleFieldBelow: this.$store.state.Settings.vmixTitleFieldBelow,
    };
  },

  methods: {
    async loadVmixInputNames() {
      this.vmixInputNames = [];

      const { data } = await axios.get(`http://${this.vmisAddress}/api`);
      const xmlDocument = new DOMParser().parseFromString(data, "text/xml");
      // Query the input number from the xml document using xpath
      const xpathResult = xmlDocument.evaluate(
        `/vmix/inputs//input/@title`,
        xmlDocument,
        document.createNSResolver(xmlDocument.documentElement),
        XPathResult.ANY_TYPE,
        null
      );

      for (let name = xpathResult.iterateNext(); name !== null; name = xpathResult.iterateNext()) {
        this.vmixInputNames.push(name.nodeValue);
      }
    },
    storeNewSettings() {
      this.$store.dispatch("updateSetting", { setting: settingNames.VMIX_HOST, newValue: this.vmisAddress });
      this.$store.dispatch("updateSetting", { setting: settingNames.VMIX_INPUT_NAME, newValue: this.inputName });
      this.$store.dispatch("updateSetting", { setting: settingNames.VMIX_OVERLAY, newValue: this.overlay });
      this.$store.dispatch("updateSetting", {
        setting: settingNames.VMIX_TITLE_FIELD_ABOVE,
        newValue: this.vmixTitleFieldAbove,
      });
      this.$store.dispatch("updateSetting", {
        setting: settingNames.VMIX_TITLE_FIELD_BELOW,
        newValue: this.vmixTitleFieldBelow,
      });
    },
  },
  mounted() {
    this.loadVmixInputNames();

    eventHub.$on("save-settings", this.storeNewSettings);
  },
};
</script>
