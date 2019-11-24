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

  let id = req.params;
  let text = req.body.txt;

  let send_data;
  let finalDoc;

  if(!(id in merge_data))
  {
    merge_data[id] = text;
    send_data = text;
  }
  else
  {
    let doc1 = Automerge.from({ cards: [] });
    doc1 = Automerge.change(doc1, 'Add card', doc => {
      doc.cards.push({ title: merge_data[id], done: false })
    })

    let doc2 = Automerge.from({ cards: [] });
    doc2 = Automerge.change(doc2, 'Add another card', doc => {
      doc.cards.push({ title: text, done: false })
    })

    finalDoc = Automerge.merge(doc1, doc2)
    merge_data[id] = finalDoc.cards[0].title;
    send_data = finalDoc.cards[0].title;
  }

  res.json({
    data : send_data
  });

});

express_app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
