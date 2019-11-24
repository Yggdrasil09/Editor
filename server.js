const Automerge = require("automerge");
const fs = require("fs");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");

const express_app = express();

express_app.use(bodyParser.urlencoded({ extended: true }));

express_app.use(bodyParser.json());

express_app.use(cors());

var merge_data = {};

express_app.post("/livecolab/:id", (req, res) => {
  console.log(req.params);
  console.log("body : ",req.body);
  let id = req.params;
  let text = req.body.txt;
  if(!(id in mergedata))
  {
    merge_data[id] = text;
  }
  else
  {
    
  }

  res.json({
    message:
      "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."
  });
});

express_app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
