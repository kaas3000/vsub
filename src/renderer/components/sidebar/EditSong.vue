<template>
  <v-dialog v-model="dialogModel" content-class="addSong">
    <v-card class="d-flex flex-column">
      <v-card-title>Ondertitels bewerken</v-card-title>
      <v-container fluid class="h-100 d-flex flex-column">
        <v-text-field style="flex: 0 0 auto;" v-model="songTitle" label="Titel"></v-text-field>
        <div style="position: relative; flex: 1 1 auto;">
          <div class="subtitleWidthHint" :style="`width: ${subtitleWidthHint}px;`"></div>
          <v-textarea
            outlined
            auto-grow
            :style="`padding-top: 1em; font-family: ${subtitleFontFamily};`"
            rows="10"
            label="Tekstregels"
            type="number"
            v-model="songLines"
          >
          </v-textarea>
        </div>

        <v-row>
          <v-col>
            <v-btn block @click="hide">Annuleren</v-btn>
          </v-col>
          <v-col>
            <v-btn
              block
              color="primary"
              @click="
                () => {
                  save();
                  hide();
                }
              "
              >Opslaan</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    currentlyEditingSongTitle: String,
  },

  data() {
    return {
      songTitle: "",
      songLines: "",
    };
  },

  computed: {
    subtitleWidthHint() {
      return this.$store.state.Settings.subtitleEditorWidthHint;
    },

    subtitleFontFamily() {
      return this.$store.state.Settings.subtitleEditorFontFamily;
    },

    dialogModel: {
      set(value) {
        if (!value) {
          this.$emit("cancel");
          return;
        }

        throw Error("Unexpected dialogModel change to true");
      },
      get() {
        return this.isVisible;
      },
    },
  },

  methods: {
    clear() {
      this.songTitle = "";
      this.songLines = "";
    },

    hide() {
      this.$emit("cancel");
    },

    save() {
      const parsedSongLines = this.songTextToSubtitleObjects(this.songLines);
      if (this.currentlyEditingSongTitle === null) {
        this.$store.dispatch("addSong", {
          title: this.songTitle,
          subtitles: parsedSongLines,
        });
      } else {
        this.$store.dispatch("updateSong", {
          oldTitle: this.currentlyEditingSongTitle,
          title: this.songTitle,
          subtitles: parsedSongLines,
        });
      }
    },

    /**
     * @param {string} songText
     * @returns {array}
     */
    songTextToSubtitleObjects(songText) {
      const songLines = songText.split("\n");
      const subtitles = [];
      for (let i = 0; i < songLines.length; i += 2) {
        subtitles.push({
          type: "subtitle",
          above: songLines[i] || "",
          below: songLines[i + 1] || "",
        });
      }

      return subtitles;
    },

    /**
     * @param {array} songData
     * @returns {string}
     */
    subtitleObjectsToSongText(subtitles) {
      return subtitles
        .filter(({ type }) => type === "subtitle")
        .map(({ above, below }) => `${above}\n${below}`)
        .join("\n")
        .trim();
    },

    /**
     * @param {string} title
     */
    loadSongData(title) {
      const { subtitles } = this.$store.state.Songs.songs[title];

      this.songTitle = title;
      this.songLines = this.subtitleObjectsToSongText(subtitles);
    },
  },

  watch: {
    isVisible(willBeVisible) {
      if (!willBeVisible) {
        this.clear();
      } else if (this.currentlyEditingSongTitle !== null) {
        this.loadSongData(this.currentlyEditingSongTitle);
      }
    },
  },
};
</script>
