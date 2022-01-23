const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer,
  loadPreferences: (type) => {
    let prefs = ipcRenderer.sendSync('load-preferences', type)
    return prefs
  },
  loadBlogPosts: (useLive = false) => {
    let posts = ipcRenderer.sendSync('get-blog-posts', useLive)
    return posts
  },
})

ipcRenderer.on('form-process-success', (event, arg) => {
  console.log('API returned: %O', arg)
})

ipcRenderer.on('form-process-fail', (event, arg) => {
  console.log('Failure: %O', arg)
})
