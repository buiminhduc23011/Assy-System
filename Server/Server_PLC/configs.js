var Res_PLC_BT = {
  I_FrameID: 'D1010,20',
  error_input_frame: 'D1030,1',
  O_FrameID: 'D910,20',
  Status_Frame: 'D930,1',
  Value_Frame: 'DFLOAT900,5',
  DoneFrame: 'D946,1',
  //
  Start_order: 'D90,1',
  cmd_agv_status: 'D991,1',
  last_order: 'D990,1',
  assy_status: 'D945,1',
  //
  Cf_OK: 'D120,1'
};
var MAC = "98-59-7A-B1-8F-50";
module.exports = { Res_PLC_BT, MAC };
