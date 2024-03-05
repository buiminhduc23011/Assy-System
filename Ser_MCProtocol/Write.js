const express = require("express");
const app = express();
const { variables_1 } = require('./configs')
var mc = require("mcprotocol");
var plc1 = new mc();
var plc2 = new mc();
var plc3 = new mc();
var plc4 = new mc();
var plc5 = new mc();
const { dataController, plc1_controller } = require('./controller')

// Cụm Băng Tải
plc1.initiateConnection(
  { port: 5002, host: '192.168.1.11', ascii: false },
  connected_plc1
);
function connected_plc1(err) {
  if (typeof err !== "undefined") {
    console.log(err);
    process.exit();
  }
  plc1.setTranslationCB(function (tag) {
    return variables_1[tag];
  });
  plc1.addItems(Object.keys(variables_1));
}

const bodyParser = require("body-parser");
//
app.use(bodyParser.json());

app.post("/api/Control_PLC_1", (req, res) => { plc1_controller(plc1, req, res); });

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
