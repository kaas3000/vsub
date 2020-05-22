<template>
  <v-container>
    <v-card>
      <v-card-title>
        Settings
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                label="vMix IP addres"
                v-model="hostName"
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
                  Kies de overlay knop waar de ondertitels mee geactiveerd
                  worden
                </small>
              </div>
            </v-col>
          </v-row>
        </v-container>
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
import { ConnectionTCP } from "node-vmix";

export default {
  data() {
    return {
      hostName: this.$store.state.Settings.vmixHost,
      inputName: this.$store.state.Settings.vmixInputName,
      overlay: this.$store.state.Settings.vmixOverlay,

      vmixInputNames: [],
    };
  },

  methods: {
    loadVmixInputNames() {
      const vmixConnection = new ConnectionTCP(this.hostName);
      this.vmixInputNames = [];

      vmixConnection.on(
        "xml",
        function onXml(xml) {
          const xmlDocument = new DOMParser().parseFromString(xml, "text/xml");
          // Query the input number from the xml document using xpath
          const xpathResult = xmlDocument.evaluate(
            `/vmix/inputs//input/@title`,
            xmlDocument,
            document.createNSResolver(xmlDocument.documentElement),
            XPathResult.ANY_TYPE,
            null
          );

          for (
            let name = xpathResult.iterateNext();
            name !== null;
            name = xpathResult.iterateNext()
          ) {
            this.vmixInputNames.push(name.nodeValue);
          }

          vmixConnection.send("QUIT");
        }.bind(this)
      );

      vmixConnection.send("XML");
    },

    storeNewSettings() {
      this.$store.dispatch("setVmixHost", this.hostName);
      this.$store.dispatch("setVmixInputName", this.inputName);
      this.$store.dispatch("setVmixOverlay", this.overlay);
    },
  },
  mounted() {
    this.loadVmixInputNames();
  },
};
</script>

<style></style>
