const express = require("express");
const app = express();
const {variables_1, variables_2, variables_3, variables_4, variables_5} = require('./configs')
var mc = require("mcprotocol");
var plc1 = new mc();
var plc2 = new mc();
var plc3 = new mc();
var plc4 = new mc();
var plc5 = new mc();
const { dataController, plc1_controller } = require('./controller')

// Cụm Băng Tải
plc1.initiateConnection(
  {port: 5002, host: '192.168.1.13', ascii: false},
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
//Cụm Lồng Vỏ
plc2.initiateConnection(
  {port: 5002, host: '192.168.1.13', ascii: false},
  connected_plc2
);
function connected_plc2(err) {
  if (typeof err !== "undefined") {
    console.log(err);
    process.exit();
  }
  plc2.setTranslationCB(function (tag) {
    return variables_2[tag];
  }); 
  plc2.addItems(Object.keys(variables_2));
}
//Cụm Khoan
plc3.initiateConnection(
  {port: 5002, host: '192.168.1.15', ascii: false},
  connected_plc3
);
function connected_plc3(err) {
  if (typeof err !== "undefined") {
    console.log(err);
    process.exit();
  }
  plc3.setTranslationCB(function (tag) {
    return variables_3[tag];
  }); 
  plc3.addItems(Object.keys(variables_3));
}
//Cụm Đóng Chốt
plc4.initiateConnection(
  {port: 5002, host: '192.168.1.17', ascii: false},
  connected_plc4
);
function connected_plc4(err) {
  if (typeof err !== "undefined") {
    console.log(err);
    process.exit();
  }
  plc4.setTranslationCB(function (tag) {
    return variables_4[tag];
  }); 
  plc4.addItems(Object.keys(variables_4));
}
//Cụm Output
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
  dataController(plc1,plc2,plc3,plc4,plc5,res, req);
});
setInterval(() => {
  dataController(plc1,plc2,plc3,plc4,plc5);
  console.log("OK");
}, 10000);
app.listen(8090, () => {
  console.log("Server started on port 8090");
}); 