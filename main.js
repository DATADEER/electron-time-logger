const {handleError} = require("./utils");
const { app, BrowserWindow } = require('electron');
const path = require('path');


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

app.whenReady()
    .then(scaffoldApplication)
    .catch(handleError);

process.on('uncaughtException', function (err) {
    console.log(err);
})

