<template>
  <v-dialog v-model="dialogModel" content-class="addSong" scrollable>
    <v-card class="d-flex flex-column">
      <v-card-title>Ondertitels bewerken</v-card-title>
      <v-container fluid class="d-flex flex-column overflow-y">
        <v-text-field style="flex: 0;" v-model="songTitle" label="Titel"></v-text-field>
        <div style="position: relative; flex: 1;">
          <div class="subtitleWidthHint" :style="`width: ${subtitleWidthHint}px;`"></div>
          <div class="subtitleLineIndicator" :style="`width: ${subtitleTextAreaHasFocus ? 100 : 0}%;`"></div>
          <v-textarea
            outlined
            auto-grow
            :style="`padding-top: 1em; font-family: ${subtitleFontFamily};`"
            rows="10"
            label="Tekstregels"
            type="number"
            v-model="songLines"
            @focus="subtitleTextAreaHasFocus = true"
            @blur="subtitleTextAreaHasFocus = false"
          >
          </v-textarea>
        </div>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn text @click="hide">Annuleren</v-btn>
        <v-btn
          text
          color="primary"
          @click="
            () => {
              save();
              hide();
            }
          "
          >Opslaan</v-btn
        >
      </v-card-actions>
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

      subtitleTextAreaHasFocus: false,
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
        .map(({ above, below }) => `${above.trim()}\n${below.trim()}`)
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

<style lang="scss" scoped>
.subtitleWidthHint,
.subtitleLineIndicator {
  position: absolute;
  height: calc(100% - 3em);
  top: 1em;
}
.subtitleWidthHint {
  border-right: 1px solid #ff0000;
}

$subtitleLineBackgroundColor: transparent;
$subtitleLineDividerColor: #dedede;
$subtitleLineHeight: 3.5em;
.subtitleLineIndicator {
  margin-top: 10px;
  background: repeating-linear-gradient(
    to bottom,
    #{$subtitleLineBackgroundColor},
    #{$subtitleLineBackgroundColor} calc(#{$subtitleLineHeight} - 1px),
    #{$subtitleLineDividerColor} calc(#{$subtitleLineHeight} - 1px),
    #{$subtitleLineDividerColor} calc(#{$subtitleLineHeight})
  );
}
</style>
