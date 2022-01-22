const { app, BrowserWindow, ipcMain, dialog, shell, clipboard } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow () {
  console.log(app.getAppPath())
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    icon: path.join(app.getAppPath(), 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if(process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'renderer', 'index.html'));
  }

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
    event.reply('form-process-fail', 'No files selected...')
    return;
  }

  const templateFileContents = fs.readFileSync(
    path.join(app.getAppPath(), 'assets', 'randomizer-play.html'),
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
