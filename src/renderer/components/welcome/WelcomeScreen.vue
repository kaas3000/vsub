<template>
  <v-container class="middle overflow-y">
    <v-card outlined width="100%" max-width="1100" min-height="400">
      <v-card-title class="headline">Welkom</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-card outlined class="welcome-options">
              <v-card-title>Snel beginnen</v-card-title>
              <v-card-text>
                <div>
                  <a @click="newFile">Begin een nieuw bestand</a>
                </div>
                <div>
                  <a @click="open">Open een bestaand bestand</a>
                </div>
              </v-card-text>
            </v-card>

            <v-card outlined class="welcome-options">
              <v-card-title>Recente bestanden</v-card-title>
              <v-card-text>
                <div v-for="file in recentFiles" :key="file">
                  <a @click="openRecentFile(file)">{{ file | baseName }}</a>
                  <span>({{ file | dirName }})</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card outlined class="welcome-options keyboard-shortcuts">
              <v-card-title>Uitleg sneltoetsen</v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <span>Start/stop live:</span>
                    <kbd>Spacebar</kbd>
                  </v-row>
                  <br />

                  <v-row>
                    <span>Volgende ondertitel:</span>
                    <kbd><v-icon color="white" x-small>mdi-chevron-down</v-icon></kbd>
                  </v-row>
                  <v-row>
                    <span>Vorige ondertitel:</span>
                    <kbd><v-icon color="white" x-small>mdi-chevron-up</v-icon></kbd>
                  </v-row>
                  <v-row>
                    <span>Eerste ondertitel:</span>
                    <kbd>Home</kbd>
                  </v-row>
                  <br />

                  <v-row>
                    <span>Volgend nummer:</span>
                    <kbd>Page down</kbd>
                  </v-row>
                  <v-row>
                    <span>Vorig nummer:</span>
                    <kbd>Page up</kbd>
                  </v-row>
                  <br />

                  <v-row>
                    <span>Niet-opgeslagen wijzigingen opslaan:</span>
                    <kbd>ctrl + s</kbd>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import SaveSongMixin from "../SaveSongMixin";

export default {
  mixins: [SaveSongMixin],
  methods: {
    /**
     * @param {String} filename
     */
    openRecentFile(filename) {
      this.importSongs(filename);
      this.$router.push("/present");
    },

    newFile() {
      this.$store.dispatch("clearSession");
      this.$router.push("/present");
    },
  },
};
</script>

<style lang="scss" scoped>
.welcome-options {
  border: 0;

  .v-card {
    &__title {
      font-weight: normal;
    }
    &__text a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.keyboard-shortcuts {
  .row {
    align-items: center;
    padding: 0.5em 0;

    span {
      width: 145px;
      padding-right: 1em;
    }
  }
}
</style>
