const fs = require('fs')

self.addEventListener('message',(e)=>{
    var data = e.data;
    fs.writeFile(data.filenme,data.txt,err=>{
        if(err)
            throw err;
    })
    self.postMessage('Done');
},false);