const {ipcRenderer} = require('electron')
const prompt = require('electron-prompt');
const fs = require('fs');

var tabs = [];
let tab_bars = document.getElementById("tab-bars");
let code_editors = [];
let body_area = document.getElementById("content-area");

window.onkeyup = function(e) {

	// New tab
  if (e.ctrlKey && e.which == 78) {
    let tag = document.createElement("li");
    let link = document.createElement("a");

    $(tag).attr("id", "tab" + (tabs.length + 1).toString());

    $(link)
      .attr("href", "#menu" + (tabs.length + 1).toString())
      .attr("data-toggle", "tab").attr("id", "link"+(tabs.length + 1).toString());

    link.innerHTML =
      "Untitled Tab" +
      ' <i class="fa fa-close" id="close' +
      (tabs.length + 1).toString() +
      '" style="font-size:18px;cursor:pointer" ></i>';

    if (tabs.length == 0) {
      $(tag).addClass("active");
    }

    $(tag).append(link);
    $(tab_bars).append(tag);

    let div = document.createElement("div");
    let label = document.createElement("label");
    let text_area = document.createElement("textarea");

    $(div)
      .addClass("tab-pane fade in active")
      .attr("id", "menu" + (tabs.length + 1).toString());
    $(text_area).attr("id", "code" + (tabs.length + 1).toString());
    $(label).append(text_area);
    $(div).append(label);
    $(body_area).append(div);

    tabs.push(["Untitled Tab", "default", tabs.length + 1,false,""]);

    let textarea = document.getElementById("code" + tabs.length.toString());
    let editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      border: true,
      theme: "eclipse",
      mode: "application/json",
      gutters: ["CodeMirror-lint-markers"],
      styleActiveLine: true,
      lint: true
    });

    code_editors.push(editor);
  }

  //file saving

  if(e.ctrlKey && e.which == 83)
	{
		for(let i=0;i<tabs.length;i++)
		{
			if($(document.getElementById("tab" + tabs[i][2].toString())).hasClass('active'))
			{
				let filename = tabs[i][0];
				if(filename == "Untitled Tab")
				{
          prompt({
            title: 'Save file',
            label: 'Enter the name of file:',
            value: '',
            inputAttrs: {
                type: 'text'
            },
            type: 'input'
          })
          .then((r) => {
              if(r === null) {
                  console.log('user cancelled');
              } 
              else
              {
                filename = r;
                tabs[i][0] = filename;
                let link = document.getElementById("link"+tabs[i][2].toString());
                link.innerHTML =filename +
                ' <i class="fa fa-close" id="close' +
                (tabs[i][2]).toString() +
                '" style="font-size:18px;cursor:pointer" ></i>';
                
                code_editors[i].on('change',()=>{
                  let text = code_editors[i].getValue();
                  let data = {
                    txt : text,
                    filenme : filename
                  }
                  var savefile_worker = new Worker('../savefile.js');

                  savefile_worker.postMessage(data);

                  savefile_worker.addEventListener('message',(e)=>{
                    if(e === 'Done');
                  },false);

                  if(tabs[i][3] == true)
                  {
                    let data = {
                      txt : text,
                      filenme : filename,
                      url : tabs[i][4]
                    }
                    console.log("connecting...")
                    var share_worker = new Worker('../request.js');
                    share_worker.postMessage(data);
                  }  
                })
              }
          })
          .catch(console.error);
        }

			}
		}
	}

};


setInterval(() => {
  for (let i = 0; i < tabs.length; i++) {
    if (!document.getElementById("close" + tabs[i][2].toString())) continue;
    document
      .getElementById("close" + tabs[i][2].toString())
      .addEventListener("click", () => {
        if (document.getElementById("menu" + tabs[i][2].toString()))
          document.getElementById("menu" + tabs[i][2].toString()).remove();
        if (document.getElementById("tab" + tabs[i][2].toString()))
          document.getElementById("tab" + tabs[i][2].toString()).remove();
        tabs.splice(i, 0);
        code_editors.splice(i, 0);
        if (tabs.length != 0) {
          $(document.getElementById("tab" + tabs[0][2].toString())).addClass(
            "active"
          );
          $(document.getElementById("menu" + tabs[0][2].toString())).addClass(
            "active"
		  );
        }
      });
  }
  if(tabs.length!=0)
  {
    $(document.getElementById('livebutton')).removeClass('active1');
    $(document.getElementById('connectbutton')).removeClass('active2');
  }
  else
  {
    $(document.getElementById('livebutton')).addClass('active1');
    $(document.getElementById('connectbutton')).addClass('active2');
  }
}, 500);


document.getElementById('livebutton').addEventListener('click',()=>{
  for(let i=0;i<tabs.length;i++)
  {
    if($(document.getElementById("tab" + tabs[i][2].toString())).hasClass('active'))
    {
      if(tabs[i][0] == "Untitled Tab")
      {
        alert("Save the file before sharing!!")
      }
      else
      {
        let token;
        ipcRenderer.send('generate-token')
        ipcRenderer.on('receive-token',(e,arg)=>{
          // token = arg;
          token = "http://localhost:8000/livecolab/"+arg;
          prompt({
            title: 'The generated url for file sharing',
            label: 'Share the line to connect:',
            value: token,
            inputAttrs: {
                type: 'text'
            },
          
          })
          .then((r) => {
            tabs[i][3] = true
            tabs[i][4] = token
          })
          .catch(console.error);
        })
      }
    }
  }
})

document.getElementById('connectbutton').addEventListener('click',()=>{
  for(let i=0;i<tabs.length;i++)
  {
    if($(document.getElementById("tab" + tabs[i][2].toString())).hasClass('active'))
    {
      if(tabs[i][0] == "Untitled Tab")
      {
        alert("Save the file before sharing!!")
      }
      else
      {
        prompt({
          title: 'Connect to live host',
          label: 'Enter the url to connect:',
          value: '',
          inputAttrs: {
              type: 'text'
          },
          type: 'input'
        })
        .then((r) => {
            if(r === null) {
                console.log('user cancelled');
            } 
        })
        .catch(console.error);
      }
    }
  }
})