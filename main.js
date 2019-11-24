const { app, BrowserWindow } = require("electron");
const Automerge = require("automerge");
const TokenGenerator = require("uuid-token-generator");
const { ipcMain } = require("electron");


let win;

function createWindow() {

  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      sandbox: false
    }
  });

  win.maximize();

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

const token = new TokenGenerator(); // Default is a 128-bit token encoded in base58

ipcMain.on("generate-token", (e, arg) => {
  e.sender.send("receive-token", token.generate());
});
