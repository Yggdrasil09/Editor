const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const Automerge = require("automerge");
const fs = require('fs');
const server = require('http').createServer();
const io = require('socket.io')(server)

let doc1 = Automerge.from({ cards: [] });

let win;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
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

ipcMain.on("live-editing", (event, arg) => {
  console.log(arg);
});

// ipcMain.on("save-file", (event, arg) => {});

io.on('connection',function(client){

  client.on('share',()=>{
    console.log("connected")
  })

  client.on('disconnect',function(){
    console.log('client disconnected ..',client.id)
  })

  client.on('error',function(err){
    console.log('received error from client : ',client.id)
    console.log(err)
  })

})

server.listen(3000,function(err){
  if (err) throw err
  console.log('listening on port : 3000')
})