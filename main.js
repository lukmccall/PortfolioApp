const {app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('path');
const url = require('url');

let win; // main window

global.lang = app.getLocale(); // set default lang
if( global.lang != "pl" || global.lang != "en" ) global.lang = "pl";

process.env.root = __dirname; // set root patch

function createWindow () {
    win = new BrowserWindow({
        width: 1200, 
        height: 800, 
        show: false,  
        webPreferences: {
            nodeIntegration: true
         } 
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/view/mainView/mainView.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    });

    win.once('ready-to-show', () => { // smoth open
        win.show();
    });        
}

// app.disableHardwareAcceleration();

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

//unpase
ipcMain.on('unpause', (e, p) => {
    if( p ) win.show(); // make sure if main window is visible
    win.send('unpause', p );
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
