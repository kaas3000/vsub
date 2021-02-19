import { remote } from "electron";
import fs from "fs";
import path from "path";

const { dialog } = remote;

export default {
  computed: {
    currentFile() {
      if (this.$store.state.Songs.currentFile === null) {
        return null;
      }

      return path.basename(this.$store.state.Songs.currentFile);
    },

    hasUnsavedChanges() {
      return this.$store.state.Songs.hasChangedSinceLastSave;
    },
  },

  methods: {
    /**
     * @param {String} location
     */
    importSongs(location) {
      const data = fs.readFileSync(location, { encoding: "utf8" });
      this.$store.dispatch("loadSongs", JSON.parse(data));
      this.$store.dispatch("setCurrentFile", location);
    },

    /**
     * @param {String} location
     */
    exportSongs(location) {
      const data = JSON.stringify(this.$store.state.Songs.songs);

      fs.writeFileSync(location, data, { encoding: "utf8" });

      this.$store.dispatch("setChangedSinceLastSave", false);
      this.$store.dispatch("setCurrentFile", location);
    },

    open() {
      const dialogResult = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [{ name: "Liturgie (*.json)", extensions: ["json"] }],
      });

      const [location] = dialogResult ?? [null];

      if (location === null) {
        return;
      }

      const data = fs.readFileSync(location, { encoding: "utf8" });
      this.$store.dispatch("loadSongs", JSON.parse(data));
      this.$store.dispatch("setCurrentFile", location);
    },

    save() {
      let location = this.$store.state.Songs.currentFile;

      if (location === null) {
        location =
          dialog.showSaveDialogSync({
            filters: [{ name: "Liturgie (*.json)", extensions: ["json"] }],
          }) ?? null;
      }

      if (location === null) {
        return;
      }

      this.exportSongs(location);
    },
  },
};
