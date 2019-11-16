const { app, BrowserWindow } = require("electron");
const { ipcMain } = require('electron');
const Automerge = require('automerge')

let doc1 = Automerge.from({ cards: [] })

let win;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.maximize()

  win.loadFile("src/index.html");

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('live-editing',(event,arg) => {
  console.log(arg);
});