const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer,
  loadPreferences: () => ipcRenderer.invoke('load-preferences'),
})

ipcRenderer.on('form-process-success', (event, arg) => {
  console.log('API returned: %O', arg)
})

ipcRenderer.on('form-process-fail', (event, arg) => {
  console.log('Failure: %O', arg)
})
