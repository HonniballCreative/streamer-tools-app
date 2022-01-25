const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const xml2js = require('xml2js')
const pjson = require('../../package.json')

const Store = require('./store/index.js')

const userPreferences = new Store('ui');


function createWindow () {
  const appDir = path.join(app.getPath('documents'), app.getName())
  if(!fs.existsSync(appDir)) fs.mkdirSync(appDir)

  let { width, height } = userPreferences.get('windowBounds');

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if(process.env.NODE_ENV === 'development'){
    const rendererPort = process.argv[2];
    const loadUrl = `http://127.0.0.1:${rendererPort}`;
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

ipcMain.on('load-preferences', (event, type) => {
  const prefs = new Store(type);
  event.returnValue = prefs.data
})

ipcMain.on('get-blog-posts', async (event, useLive = false) => {
  const parser = new xml2js.Parser({
    mergeAttrs: true,
    explicitArray: false,
    charkey: 'text',
  })

  let url = 'https://streameredu.com'
  if(process.env.NODE_ENV === 'development' && !useLive){
    url = 'http://127.0.0.1:4000'
  }

  let xml
  let json
  let entries
  try {
    const response = await fetch(`${url}/feed/by_tag/streamerific.xml`)
    xml = await response.text();
    await parser.parseString(xml, (err, result) => {
      json = result
    });
    entries = (Array.isArray(json.feed.entry)) ? json.feed.entry : [json.feed.entry]
  } catch(e){
    entries = []
  }
  event.returnValue = entries
})

ipcMain.on('get-update-post', async (event, useLive = false) => {
  const parser = new xml2js.Parser({
    mergeAttrs: true,
    explicitArray: false,
    charkey: 'text',
  })

  let url = 'https://streameredu.com'
  if(process.env.NODE_ENV === 'development' && !useLive){
    url = 'http://127.0.0.1:4000'
  }

  let xml
  let json
  let entry
  try {
    const response = await fetch(`${url}/feed/by_tag/updates.xml`)
    xml = await response.text();
    await parser.parseString(xml, (err, result) => {
      json = result
    });
    entry = (Array.isArray(json.feed.entry)) ? json.feed.entry[0] : json.feed.entry
    if(entry.title.text.endsWith(`v${pjson.version}`)){
      entry = null
    }
  } catch(e){
    entry = null
  }
  event.returnValue = entry
})

require('./modules/video-randomizer.js')
