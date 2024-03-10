const { Res_PLC_Test } = require('./configs');
var nodes7 = require('nodes7');
var plc = new nodes7;
plc.initiateConnection({ port: 102, host: '192.168.1.177', rack: 0, slot: 1, debug: false }, connect_plc);

//
function connect_plc(err) {
    if (typeof (err) !== "undefined") {
        // We have an error. Maybe the PLC is not reachable.
        console.log(err);
        process.exit();
    }
    plc.setTranslationCB(function (tag) {
        return Res_PLC_Test[tag];
    });
    plc.addItems(Object.keys(Res_PLC_Test));
}
//var mc = require('mcprotocol');
//plc.initiateConnection({port: 1281, host: '192.168.0.2', ascii: false}, connected); 
//const { Res_PLC_BT } = require('./configs');
// function connect_plc(err) {
//     if (typeof (err) !== "undefined") {
//         // We have an error. Maybe the PLC is not reachable.
//         console.log(err);
//         process.exit();
//     }
//     plc.setTranslationCB(function (tag) {
//         return Res_PLC_BT[tag];
//     });
//     plc.addItems(Object.keys(Res_PLC_BT));
// }
module.exports = {
    connect_plc,
    plc,
};