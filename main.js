const {handleError} = require("./utils");
const {app, BrowserWindow, Menu, Tray} = require('electron');
const path = require('path');
require('electron-reload')(__dirname);
const {default: installExtension, REACT_DEVELOPER_TOOLS} = require('electron-devtools-installer');


let allWindows = {};

function loadMainWindow(mainWindow){

    if (process.env.ELECTRON_IS_DEV) {
        console.log("LOADING DEV VERSION");
        mainWindow.loadURL(`http://localhost:3000`);
    } else {
        console.log("LOADING PROD VERSION");
        mainWindow.loadURL(`file://${path.join(__dirname, 'build', 'index.html')}`);
    }

}

function installDevtools(){
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
}

function scaffoldApplication() {

    allWindows.main = new BrowserWindow({width: 800, height: 600, show: false});

    loadMainWindow(allWindows.main);

    allWindows.main.once("ready-to-show", () => {
        allWindows.main.show();
        installDevtools();
    })
}

function initTray() {

}

app.whenReady()
    .then(() => {
        initTray();
        scaffoldApplication();
    })
    .catch(handleError);

process.on('uncaughtException', function (err) {
    console.log(err);
});

