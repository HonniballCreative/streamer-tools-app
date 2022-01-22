const { app, ipcMain, dialog, shell, clipboard } = require('electron')
const path = require('path')
const fs = require('fs')

const Store = require('../store.js')

const randomizerStore = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'video-randomizer',
  defaults: {
    files: []
  }
});

ipcMain.handle('create-randomizer-file', (event, formData) => {
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

    let existingFiles = randomizerStore.get('files')
    // If the filename already exists in the store then the user is
    // overwriting the file.
    if(existingFiles.indexOf(userSelectedPath) === -1){
      existingFiles.push(userSelectedPath)
      randomizerStore.set('files', existingFiles)
    }

    return {
      status: 'success',
      message: 'File saved!',
      formData: formData,
      savePath: userSelectedPath,
    }
  }
})
