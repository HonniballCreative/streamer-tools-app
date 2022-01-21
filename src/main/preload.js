const pjson = require('../../package.json');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  version: pjson.verson,
  ipcRenderer: ipcRenderer,
})
