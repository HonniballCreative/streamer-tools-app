const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer,
  loadPreferences: () => {
    let prefs = ipcRenderer.sendSync('load-preferences')
    return prefs
  },
})

ipcRenderer.on('form-process-success', (event, arg) => {
  console.log('API returned: %O', arg)
})

ipcRenderer.on('form-process-fail', (event, arg) => {
  console.log('Failure: %O', arg)
})
