import { app, BrowserWindow } from 'electron' // eslint-disable-line

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;
const jsonHost = '0.0.0.0';
const jsonPort = 8067;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createJsonServer() {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { ipcMain } = require('electron');
  const { createServer } = require('http');

  const jsonServer = createServer(async (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    let subtitles;
    try {
      subtitles = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout getting subtitles')), 100);

        ipcMain.once('song-subtitles-resp', (event, subtitles) => {
          clearTimeout(timeout);
          resolve(subtitles);
        });

        mainWindow.webContents.send('song-subtitles-req');
      });
    } catch (err) {
      console.error(err);
      response.end();
      return;
    }

    response.end(JSON.stringify(subtitles));
  });

  jsonServer.listen(jsonPort, jsonHost);
}

app.on('ready', () => {
  createWindow();
  createJsonServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
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
