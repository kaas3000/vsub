import { app, BrowserWindow, dialog } from "electron";

import Store from "electron-store";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\"); // eslint-disable-line
}

Store.initRenderer();
app.showExitPrompt = false;

let mainWindow;
const winURL = process.env.NODE_ENV === "development" ? "http://localhost:9080" : `file://${__dirname}/index.html`;

const parameterStore = new Store({ name: "window-parameters" });
function loadWindowParameters() {
  const { width, height } = parameterStore.get("dimensions", { width: null, height: null });
  const { x, y } = parameterStore.get("location", { x: null, y: null });

  return { x, y, width, height };
}

function createWindow() {
  /**
   * Initial window options
   */
  const { x, y, width, height } = loadWindowParameters();

  mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  function storeWindowParameters() {
    const { x, y, width, height } = mainWindow.getBounds();

    parameterStore.set("dimensions", { width, height });
    parameterStore.set("location", { x, y });
  }

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("resize", () => storeWindowParameters());
  mainWindow.on("moved", () => storeWindowParameters());

  mainWindow.on("close", (e) => {
    if (app.showExitPrompt) {
      e.preventDefault(); // Prevents the window from closing
      const response = dialog.showMessageBoxSync({
        type: "question",
        buttons: ["Afsluiten", "Terug"],
        title: "Onopgeslagen wijzigingen",
        message: "Nog niet alle wijzigingen zijn opgeslagen. Weet je zeker dat je wilt afsluiten?",
        defaultId: 1,
        cancelId: 1,
      });
      const closeIsUnintended = response === 0;
      if (closeIsUnintended) {
        app.showExitPrompt = false;
        mainWindow.close();
      }
    }
  });
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
