const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer,
  loadPreferences: (type) => {
    let prefs = ipcRenderer.sendSync('load-preferences', type)
    return prefs
  },
})

ipcRenderer.on('form-process-success', (event, arg) => {
  console.log('API returned: %O', arg)
})

ipcRenderer.on('form-process-fail', (event, arg) => {
  console.log('Failure: %O', arg)
})
