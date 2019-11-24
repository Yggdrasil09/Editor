self.addEventListener('message',(e)=>{

    var data = e.data;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST" , data.url, false ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    console.log(data)
    xmlHttp.send(JSON.stringify(data));
    console.log(xmlHttp.responseText);

},false);