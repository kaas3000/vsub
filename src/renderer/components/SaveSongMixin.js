import { remote } from "electron";
import fs from "fs";
import path from "path";

const { dialog } = remote;

export default {
  computed: {
    currentFile() {
      return this.$store.state.SaveFiles.currentFile;
    },

    hasUnsavedChanges() {
      return this.$store.state.Songs.hasChangedSinceLastSave;
    },

    recentFiles() {
      return this.$store.state.SaveFiles.recentFiles;
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
      this.$router.push("/present");
    },

    save() {
      let location = this.$store.state.SaveFiles.currentFile;

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

  filters: {
    /**
     * @param {String} fullFileName
     * @returns {String}
     */
    baseName(fullFileName) {
      return path.basename(fullFileName);
    },

    /**
     * @param {String} fullFileName
     * @returns {String}
     */
    dirName(fullFileName) {
      return path.dirname(fullFileName);
    },
  },
};
