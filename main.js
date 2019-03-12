const {handleError} = require("./utils");
const {app, BrowserWindow, Menu, Tray, ipcMain} = require('electron');
const path = require('path');

const {default: installExtension, REACT_DEVELOPER_TOOLS} = require('electron-devtools-installer');


let allWindows = {};

function scaffoldApplication() {
    allWindows.main = new BrowserWindow({width: 800, height: 600, show: false});
    allWindows.tray = new BrowserWindow({width: 250, height: 500, show: false, frame: false});

    if (process.env.ELECTRON_IS_DEV) {
        console.log("LOADING DEV VERSION");
        allWindows.main.loadURL(`http://localhost:3000`);
    } else {
        console.log("LOADING PROD VERSION");
        allWindows.main.loadURL(`file://${path.join(__dirname, 'build', 'index.html')}`);
    }
    allWindows.tray.loadURL(`file://${path.join(__dirname, 'public', 'tray.html')}`);

    allWindows.main.once("ready-to-show", () => {
        allWindows.main.show()
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));

        //allWindows.main.webContents.openDevTools()
    })
}

function toggleStartStop(menuTemplate, trayIcon) {



    if (menuTemplate[3].id === "STOP-TICKET") {
        menuTemplate[3].label = "START JIRA-2314";
        menuTemplate[3].icon = "src/static/icons/tray/play.png";
        menuTemplate[3].id = "START-TICKET";
        menuTemplate[3].accelerator = "Alt+S";
        allWindows.main.send("toggle-start", false)
    } else {
        menuTemplate[3].label = "STOP JIRA-2314";
        menuTemplate[3].icon = "src/static/icons/tray/stop.png";
        menuTemplate[3].id = "STOP-TICKET";
        menuTemplate[3].accelerator = "Alt+S";
        allWindows.main.send("toggle-start", true)
    }
    const contextMenu = Menu.buildFromTemplate(menuTemplate);
    trayIcon.setContextMenu(contextMenu);

}

function initTray() {
    const trayIcon = new Tray("src/static/icons/tray/tray.png");
    trayIcon.setIgnoreDoubleClickEvents(true);

    trayIcon.on('click', (event, bounds)=> {
        allWindows.tray.setPosition(bounds.x, bounds.y);
        allWindows.tray.isVisible() ? allWindows.tray.hide() : allWindows.tray.show();
    });

    const menuTemplate = [
        { role: 'about'},
        { type: 'separator' },
        { label: "23m", enabled: false},
        { label: 'START JIRA-2314', id:"START-TICKET", accelerator:"Alt+S", icon:"src/static/icons/tray/play.png", type: 'normal', click: () => toggleStartStop(menuTemplate, trayIcon)},
        { icon: "src/static/icons/tray/ticket.png", label: 'Tickets', submenu: [
                { label: 'JIRA-2324' },
                { label: 'JIRA-2124' },
                { label: 'JIRA-2114' },
            ]
        },
        { label: "settings", click: (event) => {
            console.log(event, event);
            allWindows.tray.setPosition(event.position.x,event.position.y);
            allWindows.tray.show();

        }},
        { type: 'separator' },
        { role: 'quit'}
    ];
    const contextMenu = Menu.buildFromTemplate(menuTemplate);
    //trayIcon.setContextMenu(contextMenu); // click won't be fired if contextMenu is set
    trayIcon.setToolTip("Electron Time Logger")



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

