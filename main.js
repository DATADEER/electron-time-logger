const {handleError} = require("./utils");
const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');

const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));


function createWindow () {
    return new BrowserWindow({ width: 800, height: 600, show:false});
}

let allWindows = {};
function scaffoldApplication() {
    allWindows.main = createWindow();

    if(process.env.ELECTRON_IS_DEV){
        console.log("LOADING DEV VERSION")
        allWindows.main.loadURL(`http://localhost:3000`);
    }else {
        console.log("LOADING PROD VERSION")
        allWindows.main.loadURL(`file://${path.join(__dirname, 'build','index.html')}`);
    }

    allWindows.main.once("ready-to-show", () => {
        allWindows.main.show()
        //allWindows.main.webContents.openDevTools()
    })
}

function toggleStartStop(menuTemplate, trayIcon){
    if(menuTemplate[0].label === "Start"){
        menuTemplate[0].label = "Stop";
        allWindows.main.send("toggle-start", true)
    }else {
        menuTemplate[0].label = "Start";
        allWindows.main.send("toggle-start", false)
    }
    const contextMenu = Menu.buildFromTemplate(menuTemplate);
    trayIcon.setContextMenu(contextMenu);


}

function initTray(){
    const trayIcon = new Tray("tray.png");
    const menuTemplate = [
        { label: 'Start', type: 'normal', click: () => toggleStartStop(menuTemplate, trayIcon)},
    ];
    const contextMenu = Menu.buildFromTemplate(menuTemplate);
    trayIcon.setContextMenu(contextMenu);



}

app.whenReady()
    .then(() => {
        initTray();
        scaffoldApplication()
    })
    .catch(handleError);

process.on('uncaughtException', function (err) {
    console.log(err);
})

