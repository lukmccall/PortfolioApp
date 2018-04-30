const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;

global.lang = app.getLocale(); // set default lang
if( global.lang != "pl" || global.lang != "en" ) global.lang = "pl";

process.env.root = __dirname; // set root patch

function createWindow () {
    
    win = new BrowserWindow({width: 1200, height: 800});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
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


//----------------- Global method -------------------------//
exports.getView = name => {
    return url.format({
        pathname: path.join(__dirname, 'src/view/', name, name+".html" ),
        protocol: 'file:',
        slashes: true
    });
};