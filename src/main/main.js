const { app, BrowserWindow, ipcMain, dialog, shell, clipboard } = require('electron')
const path = require('path')
const fs = require('fs')

const Store = require('./store.js')

const userPreferences = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 1000, height: 1000 }
  }
});

function createWindow () {
  // First we'll get our height and width. This will be the defaults if there wasn't anything saved
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
    console.log(loadUrl);
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

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.handle('form-submit', (event, formData) => {
  const settingsStr = '{/* settings */}'
  const destFile = 'randomizer.html'

  if(formData.files.length < 1){
    dialog.showMessageBox({
      message: 'Please add some video files.',
      type: 'error',
      title: 'Unable to Save Randomizer'
    })
    return {
      status: 'error',
      message: 'No files selected...'
    }
  }

  const templateFileContents = fs.readFileSync(
    path.join(app.getAppPath(), 'static', 'randomizer-play.html'),
    { encoding:'utf8', flag:'r' }
  );

  const newFileContents = templateFileContents.replace(settingsStr, JSON.stringify(formData))

  const userSelectedPath = dialog.showSaveDialogSync({
    title: 'Save Your Randomizer File.',
    buttonLabel: 'Save Randomizer',
    defaultPath: path.join(app.getPath('downloads'), destFile),
    filters: [
      { name: 'HTML Randomizer', extensions: ['html'] }
    ],
    properties: ['createDirectory']
  })

  if(!userSelectedPath){
    return {
      status: 'cancelled'
    }
  } else {
    fs.writeFileSync(userSelectedPath, newFileContents, 'utf8')

    dialog.showMessageBox({
      buttons: ['Yes', 'No'],
      message: 'Randomizer saved and URL copied to your clipboard!\nWould you like to open your randomizer in your browser?',
      type: 'none',
      title: 'Randomizer Saved and Loaded!',
      noLink: true,
    }).then((result) => {
      clipboard.writeText(`file:///${userSelectedPath.replace(/\\{1,2}/g, '/')}`)

      if(result.response === 0){
        shell.openExternal(userSelectedPath)
      }
    })


    return {
      status: 'success',
      message: 'File saved!',
      formData: formData,
      savePath: userSelectedPath,
    }
  }
})
