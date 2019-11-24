self.addEventListener('message',(e)=>{

    var data = e.data;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST" , data.url, false ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(data));
    var result = (xmlHttp.responseText).data;

    self.postMessage(result);

},false);