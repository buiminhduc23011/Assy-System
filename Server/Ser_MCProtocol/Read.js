const express = require("express");
const app = express();
const {variables_1,variables_5} = require('./configs')
var mc = require("mcprotocol");
var plc1 = new mc();
var plc5 = new mc();
const { dataController, plc1_controller } = require('./controller')

// Cụm Băng Tải
plc1.initiateConnection(
  {port: 5002, host: '192.168.1.11', ascii: false},
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
//Cujm Out
plc5.initiateConnection(
  {port: 5002, host: '192.168.1.19', ascii: false},
  connected_plc5
);
function connected_plc5(err) {
  if (typeof err !== "undefined") {
    console.log(err);
    process.exit();
  }
  plc5.setTranslationCB(function (tag) {
    return variables_5[tag];
  }); 
  plc5.addItems(Object.keys(variables_5));
}


const bodyParser = require("body-parser");
//
app.use(bodyParser.json());

app.get("/api/data", (req, res) => {
  dataController(plc1,plc5,res, req);
});
// setInterval(() => {
//   plc1.readAllItems(valuesReady);
//   }, 1000);

app.listen(8090, () => {
  console.log("Server started on port 8090");
}); 
// function valuesReady(anythingBad, values) {
// 	if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
// 	console.log(values);
// 	doneReading = true;
// //	if (doneWriting) { process.exit(); }
// }