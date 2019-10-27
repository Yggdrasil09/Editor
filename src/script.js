function deleteAt(string, index) {
  return string.substr(0, index) + string.substr(index + 1);
}

let masters = ["https://loki.gauntlet.cloudbees.com/"];
let jobs = [
  "cloudbees-cd-analytics/master",
  "cloudbees-cd-analytics/staging",
  "prod-deploy/master"
];

jobs.pop(); 

let json = {
  phases: [
    {
      id: "dev",
      name: "Dev",
      gates: [
        {
          id: "dev",
          name: "Dev",
          master: "https://loki.gauntlet.cloudbees.com/",
          job: "cloudbees-cd-analytics/master",
          feeds: "staging"
        }
      ]
    },
    {
      id: "staging",
      name: "Staging",
      gates: [
        {
          id: "staging",
          name: "Staging",
          master: "https://loki.gauntlet.cloudbees.com/",
          job: "cloudbees-cd-analytics/staging",
          feeds: "production"
        }
      ]
    },
    {
      id: "production",
      name: "Production",
      gates: [
        {
          id: "production",
          name: "Production",
          master: "https://loki.gauntlet.cloudbees.com/",
          job: "prod-deploy/master"
        }
      ]
    }
  ]
};

let stringified = JSON.stringify(json, null, 2);
stringified = deleteAt(stringified, 110); // remove a comma

let textarea = document.getElementById("code");
textarea.value = stringified;

let editor = CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  border: true,
  theme: "eclipse",
  mode: "application/json",
  gutters: ["CodeMirror-lint-markers"],
  styleActiveLine: true,
  lint: true
});

// var container = document.createElement("div")
// container.innerText = "Unknown job."
// editor.addLineWidget(9, container)
