const { contextBridge, ipcRenderer } = require('electron')
const pjson = require('../../package.json')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer,
  appVersion: pjson.version,
  loadPreferences: (type) => {
    let prefs = ipcRenderer.sendSync('load-preferences', type)
    return prefs
  },
  loadBlogPosts: (useLive = false) => {
    let posts = ipcRenderer.sendSync('get-blog-posts', useLive)
    return posts
  },
  loadUpdatePost: (useLive = false) => {
    let post = ipcRenderer.sendSync('get-update-post', useLive)
    return post
  },
})

ipcRenderer.on('form-process-success', (event, arg) => {
  console.log('API returned: %O', arg)
})

ipcRenderer.on('form-process-fail', (event, arg) => {
  console.log('Failure: %O', arg)
})
