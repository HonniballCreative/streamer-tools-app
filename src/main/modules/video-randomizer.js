const { app, ipcMain, dialog, clipboard } = require('electron')
const path = require('path')
const fs = require('fs')
const Store = require('../store/index.js')

const randomizerStore = new Store('video-randomizer');

ipcMain.handle('create-randomizer-file', (event, formData) => {
  const settingsStr = '{/* settings */}'

  if(formData.files.length < 1){
    return {
      status: 'error',
      title: 'Unable to Save Randomizer',
      message: 'Please add some video files.',
    }
  }

  const templateFileContents = fs.readFileSync(
    path.join(app.getAppPath(), 'static', 'randomizer-tmpl.html'),
    { encoding:'utf8', flag:'r' }
  );

  const newFileContents = templateFileContents.replace(settingsStr, JSON.stringify(formData))

  const defaultRandomizerFolder = path.join(
    (app || remote.app).getPath('documents'),
    app.getName(),
    'Randomizers'
  )
  if(!fs.existsSync(defaultRandomizerFolder)) fs.mkdirSync(defaultRandomizerFolder)

  let filePath = path.join(
    defaultRandomizerFolder,
    'randomizer.html'
  )
  index = 0
  while(fs.existsSync(filePath)){
    index++;
    filePath = path.join(
      defaultRandomizerFolder,
      `randomizer${index}.html`
    )
    if(index > 10) break;
  }

  const userSelectedPath = dialog.showSaveDialogSync({
    title: 'Save Your Randomizer File.',
    buttonLabel: 'Save Randomizer',
    defaultPath: filePath,
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
    clipboard.writeText(`file:///${userSelectedPath.replace(/\\{1,2}/g, '/')}`)

    let existingFiles = randomizerStore.get('files')
    let existingFile = existingFiles.find((f) => f.path === userSelectedPath)
    // If the filename already exists in the store then the user is
    // overwriting the file.
    if(!existingFile){
      existingFiles.push({
        path: userSelectedPath,
        valid: true,
      })
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

ipcMain.handle('delete-randomizer-file', (event, filePath) => {
  try {
    fs.unlinkSync(filePath)
  } catch(e){
    // we don't really care if it works...
  }

  let existingFiles = randomizerStore.get('files')
  let existingFileIndex = existingFiles.findIndex((f) => f.path === filePath)
  // If the filename already exists in the store then the user is
  // overwriting the file.
  if(existingFileIndex !== -1){
    existingFiles.splice(existingFileIndex, 1)
    randomizerStore.set('files', existingFiles)
  }

  return {
    status: 'success',
    message: 'File deleted!'
  }
})
