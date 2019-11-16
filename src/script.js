const { ipcRenderer } = require("electron");

var tabs = [];
let tab_bars = document.getElementById("tab-bars");
let code_editors = [];
let body_area = document.getElementById("content-area");

window.onkeyup = function(e) {
  if (e.ctrlKey && e.which == 78) {

    let tag = document.createElement("li");
	let link = document.createElement("a");
	
    $(link)
      .attr("href", "#menu" + (tabs.length + 1).toString())
	  .attr("data-toggle", "tab");
	  
    link.innerHTML =
      "Untitled Tab " +
      '<i class="fa fa-close" id="close' +
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
	
	tabs.push(["Untitled Tab", "default", tabs.length + 1,tag]);
	
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

  for (let i = 0; i < tabs.length; i++) {
    document.getElementById("close"+tabs[i][2].toString()).addEventListener('click',()=>{
		document.getElementById("menu"+tabs[i][2].toString()).remove()
		tabs.splice(i,1);
		code_editors.splice(i,1);
	})
  }

};

// let work = setInterval(() => {
//   for (let i = 0; i < code_editors.length; i++) {
//     let text = code_editors[i].getValue();
//     ipcRenderer.send("live-editing", text);
//   }
// }, 500);
