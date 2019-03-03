const {handleError} = require("./utils");
const { app, BrowserWindow } = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, "node_modules",".bin","electron"),
    //forceHardReset: true
});
const debug = require('electron-debug');
debug({showDevTools:false}); //allows for easy debugging by clicking f12

function createWindow () {
    return new BrowserWindow({ width: 800, height: 600, show:false});
}

let allWindows = {};
function scaffoldApplication() {
    allWindows.main = createWindow();

    allWindows.main.loadURL(`http://localhost:3000`);
    //allWindows.main.loadURL(`file://${path.join(__dirname, 'build','index.html')}`)
    //allWindows.main.loadURL(`${__dirname}/public/index.html`);
    allWindows.main.once("ready-to-show", () => {
        console.log("ready to show")
        allWindows.main.show()
    })
}

app.whenReady()
    .then(scaffoldApplication)
    .catch(handleError)

