const { Res_PLC_BT } = require('./configs');
var mc = require('mcprotocol');
var plc = new mc();
plc.initiateConnection({port: 5002, host: '192.168.1.11', ascii: false}, connect_plc); 
function connect_plc(err) {
    if (typeof (err) !== "undefined") {
        console.log(err);
        process.exit();
    }
    plc.setTranslationCB(function (tag) {
        return Res_PLC_BT[tag];
    });
    plc.addItems(Object.keys(Res_PLC_BT));
}
module.exports = {
    connect_plc,
    plc,
};