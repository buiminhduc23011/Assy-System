var Res_PLC_BT = {
  I_FrameID: 'D1010,20',
  O_FrameID: 'D910,20',
  Status_Frame: 'D980,1',
  Value_Frame: 'DFLOAT981,5',
};

var Res_PLC_Test = {
  I_FrameID: 'DB1,INT0.20',
  error_input_frame: 'DB1,X110.0',
  O_FrameID: 'DB1,INT40.20',
  Status_Frame: 'DB1,INT80',
  Value_Frame: 'DB1,REAL82.5',
  Start_order: 'DB1,X102.0',
  cmd_agv_status: 'DB1,INT104',
  last_order: 'DB1,X106.0',
  assy_status: 'DB1,INT108',
};
var MAC = "98-59-7A-B1-8F-50";
module.exports = { Res_PLC_BT, Res_PLC_Test, MAC };
