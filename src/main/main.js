const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')

const Store = require('./store/index.js')

const userPreferences = new Store('ui');

function createWindow () {
  const appDir = path.join(app.getPath('documents'), app.getName())
  if(!fs.existsSync(appDir)) fs.mkdirSync(appDir)

  let { width, height } = userPreferences.get('windowBounds');

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if(process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    const loadUrl = `http://127.0.0.1:${rendererPort}`;
    mainWindow.loadURL(loadUrl);
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'renderer', 'index.html'));
  }

  // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    userPreferences.set('windowBounds', { width, height });
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if(BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if(process.platform !== 'darwin') app.quit()
});

ipcMain.on('load-preferences', (event, type) => {
  const prefs = new Store(type);
  event.returnValue = prefs.data
})

require('./modules/video-randomizer.js')
