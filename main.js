const {app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('path');
const url = require('url');

let win;

global.lang = app.getLocale(); // set default lang
if( global.lang != "pl" || global.lang != "en" ) global.lang = "pl";

process.env.root = __dirname; // set root patch

function createWindow () {
    win = new BrowserWindow({width: 1200, height: 800});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/view/mainView/mainView.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // for macOs
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // for macOs
    if (win === null) {
        createWindow();
    }
});

//----------------- Events --------------------------//
// lang change
ipcMain.on('lang-change', ( e, lang ) => {
    global.lang = lang;
    let windows = webContents.getAllWebContents();
    
    // sent to all window information about lang
    for( let i = 0; i < windows.length; i++ ){
        if( windows[ i ] != null && windows[ i ].webContents != null ){
            windows[ i ].webContents.send('lang-change', lang);
        }
    }   
});

//----------------- Global method -------------------------//
/*
*   get string name - view name
*   return string path - path to view
*/
exports.getView = name => {
    return url.format({
        pathname: path.join(__dirname, 'src/view/', name, name+".html" ),
        protocol: 'file:',
        slashes: true
    });
};
