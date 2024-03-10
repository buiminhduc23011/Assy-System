using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.IO;
using Newtonsoft.Json;
using System.Diagnostics.SymbolStore;
using Newtonsoft.Json.Linq;
using System.Windows;
using System.Windows.Controls;
namespace Assy_System_UI.Class
{
    public class PLC
    {
        //static string Task = "PLC Task: ";
        //  Link_Path path = new Link_Path();
        public static dynamic data;
        public static bool flag = false;
        private static HttpClient client = new HttpClient();
        public static bool IsConnected;
        public static string Hostting_;
        private System.Threading.Timer timer;
        private readonly object timerLock = new object();
        //
        public static string PLC_Read;
        public static string PLC_Write;
        private int Flag_PLC;


        public void Start()
        {
            PLC_Read = Common.Sys_PLC_R;
            PLC_Write = Common.Sys_PLC_W;
            timer = new System.Threading.Timer(Timer_Tick, null, 0, 3000);

        }

        public void Stop()
        {
            lock (timerLock)
            {
                timer?.Change(Timeout.Infinite, Timeout.Infinite);
            }
        }
        private uint[] ConvertToUintArray(Newtonsoft.Json.Linq.JArray jArray)
        {
            // Assuming all elements in the JArray can be safely cast to uint
            return jArray.Select(jToken => (uint)jToken).ToArray();
        }
        private float[] ConvertToFloatArray(Newtonsoft.Json.Linq.JArray jArray)
        {
            // Assuming all elements in the JArray can be safely cast to uint
            return jArray.Select(jToken => (float)jToken).ToArray();
        }
        private async void Timer_Tick(object state)
        {
            if (Flag_PLC > 3)
            {
                IsConnected = false;
            }
            else
            {
                IsConnected = true;
            }
            try
            {
                using (HttpClient client = new HttpClient())
                {

                    string response = await client.GetStringAsync("http://" + PLC_Read + "/api/data");
                    data = JsonConvert.DeserializeObject<dynamic>(response);
                    //JArray jsonArray = JArray.Parse(response);
                    //MessageBox.Show(jsonArray[0]["OrderID1"].ToString());
                    if (data != null)
                    {
                        Parse_Data(data);
                        // ResPLC.FrameID_11 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID__11));
                    }
                    Flag_PLC = 0;
                }

            }
            catch
            {
                Flag_PLC++;
                // MessageBox.Show(ex.Message);

            }
        }

        private void Parse_Data(dynamic data)
        {
            try
            {
                ResPLC.Check_QR_BT = data.Check_QR_BT;
                //
                ResPLC.OrderID1 = Process_Data.ReverseToString(ConvertToUintArray(data.OrderID1));
                ResPLC.FrameID_11 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_11));
                ResPLC.FrameID_12 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_12));
                ResPLC.FrameID_13 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_13));
                ResPLC.FrameID_14 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_14));
                ResPLC.FrameID_15 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_15));
                ResPLC.V_Frame11 = ConvertToFloatArray(data.V_Frame11);
                ResPLC.V_Frame12 = ConvertToFloatArray(data.V_Frame12);
                ResPLC.V_Frame13 = ConvertToFloatArray(data.V_Frame13);
                ResPLC.V_Frame14 = ConvertToFloatArray(data.V_Frame14);
                ResPLC.V_Frame15 = ConvertToFloatArray(data.V_Frame15);
                ResPLC.Status_Frame_Order1 = data.Status_Frame1;
                ResPLC.Status_Order1 = data.Status_Order1;
                ////
                ResPLC.OrderID2 = Process_Data.ReverseToString(ConvertToUintArray(data.OrderID2));
                ResPLC.FrameID_21 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_21));
                ResPLC.FrameID_22 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_22));
                ResPLC.FrameID_23 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_23));
                ResPLC.FrameID_24 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_24));
                ResPLC.FrameID_25 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_25));
                ResPLC.V_Frame21 = data.V_Frame21;
                ResPLC.V_Frame22 = data.V_Frame22;
                ResPLC.V_Frame23 = data.V_Frame23;
                ResPLC.V_Frame24 = data.V_Frame24;
                ResPLC.V_Frame25 = data.V_Frame25;
                ResPLC.Status_Frame_Order2 = data.Status_Frame2;
                ResPLC.Status_Order2 = data.Status_Order2;
                ////
                ResPLC.OrderID3 = Process_Data.ReverseToString(ConvertToUintArray(data.OrderID3));
                ResPLC.FrameID_31 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_31));
                ResPLC.FrameID_32 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_32));
                ResPLC.FrameID_33 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_33));
                ResPLC.FrameID_34 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_34));
                ResPLC.FrameID_35 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_35));
                ResPLC.V_Frame31 = data.V_Frame31;
                ResPLC.V_Frame32 = data.V_Frame32;
                ResPLC.V_Frame33 = data.V_Frame33;
                ResPLC.V_Frame34 = data.V_Frame34;
                ResPLC.V_Frame35 = data.V_Frame35;
                ResPLC.Status_Frame_Order3 = data.Status_Frame3;
                ResPLC.Status_Order3 = data.Status_Order3;
                ////
                ResPLC.OrderID4 = Process_Data.ReverseToString(ConvertToUintArray(data.OrderID4));
                ResPLC.FrameID_41 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_41));
                ResPLC.FrameID_42 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_42));
                ResPLC.FrameID_43 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_43));
                ResPLC.FrameID_44 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_44));
                ResPLC.FrameID_45 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_45));
                ResPLC.V_Frame41 = data.V_Frame41;
                ResPLC.V_Frame42 = data.V_Frame42;
                ResPLC.V_Frame43 = data.V_Frame43;
                ResPLC.V_Frame44 = data.V_Frame44;
                ResPLC.V_Frame45 = data.V_Frame45;
                ResPLC.Status_Frame_Order4 = data.Status_Frame4;
                ResPLC.Status_Order4 = data.Status_Order4;
                ////
                ResPLC.OrderID5 = Process_Data.ReverseToString(ConvertToUintArray(data.OrderID5));
                ResPLC.FrameID_51 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_51));
                ResPLC.FrameID_52 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_52));
                ResPLC.FrameID_53 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_53));
                ResPLC.FrameID_54 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_54));
                ResPLC.FrameID_55 = Process_Data.ReverseToString(ConvertToUintArray(data.FrameID_55));
                ResPLC.V_Frame51 = data.V_Frame51;
                ResPLC.V_Frame52 = data.V_Frame52;
                ResPLC.V_Frame53 = data.V_Frame53;
                ResPLC.V_Frame54 = data.V_Frame54;
                ResPLC.V_Frame55 = data.V_Frame55;
                ResPLC.Status_Frame_Order5 = data.Status_Frame5;
                ResPLC.Status_Order5 = data.Status_Order5;
                //
                ResPLC.Assy_status = data.assy_status;
            }
            catch { }
        }


        public async void Write(string jsonData)
        {
            try
            {
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://" + PLC_Write + "/api/Control_PLC_1", content);
                //var responseContent = await response.Content.ReadAsStringAsync();
            }
            catch
            {

            }
        }
        public async void Write5(string jsonData)
        {
            try
            {
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://" + PLC_Write + "/api/Control_PLC_5", content);
                //var responseContent = await response.Content.ReadAsStringAsync();
            }
            catch
            {

            }
        }
        public void Delete_Order(int ID)
        {
            int[] Order = new int[10];
            int[] Frame = new int[20];
            float[] Temp = new float[5];
            for (int i=0; i < 20; i++)
            {
                if(i<10) Order[i] = 0;
                if(i<5) Temp[i] = 0;
                Frame[i] = 0;
            }    
            if (ID == 1)
            {
                ResPLC.OrderID1 = "";
                ResPLC.FrameID_11 = "";
                ResPLC.FrameID_12 = "";
                ResPLC.FrameID_13 = "";
                ResPLC.FrameID_14 = "";
                ResPLC.FrameID_15 = "";
                ResPLC.V_Frame11 = Temp;
                ResPLC.V_Frame12 = Temp;
                ResPLC.V_Frame13 = Temp;
                ResPLC.V_Frame14 = Temp;
                ResPLC.V_Frame15 = Temp;

                var data = new
                {
                    OrderID1 = Order,
                    FrameID_11 = Frame,
                    FrameID_12 = Frame,
                    FrameID_13 = Frame,
                    FrameID_14 = Frame,
                    FrameID_15 = Frame,
                    V_Frame11 = Temp,
                    V_Frame12 = Temp,
                    V_Frame13 = Temp,
                    V_Frame14 = Temp,
                    V_Frame15 = Temp,
                    STT_Order1 = 0,
                    STT_Frame1 = 0,
                    SL_Frame1 = 0,
                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else if (ID == 2)
            {
                var data = new
                {
                    OrderID2 = Order,
                    FrameID_21 = Frame,
                    FrameID_22 = Frame,
                    FrameID_23 = Frame,
                    FrameID_24 = Frame,
                    FrameID_25 = Frame,
                    V_Frame21 = Temp,
                    V_Frame22 = Temp,
                    V_Frame23 = Temp,
                    V_Frame24 = Temp,
                    V_Frame25 = Temp,
                    STT_Order2 = 0,
                    STT_Frame2 = 0,
                    SL_Frame2 = 0,

                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else if (ID == 3)
            {
                var data = new
                {
                    OrderID3 = Order,
                    FrameID_31 = Frame,
                    FrameID_32 = Frame,
                    FrameID_33 = Frame,
                    FrameID_34 = Frame,
                    FrameID_35 = Frame,
                    V_Frame31 = Temp,
                    V_Frame32 = Temp,
                    V_Frame33 = Temp,
                    V_Frame34 = Temp,
                    V_Frame35 = Temp,
                    STT_Order3 = 0,
                    STT_Frame3 = 0,
                    SL_Frame3 = 0,

                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else if (ID == 4)
            {
                var data = new
                {
                    OrderID4 = Order,
                    FrameID_41 = Frame,
                    FrameID_42 = Frame,
                    FrameID_43 = Frame,
                    FrameID_44 = Frame,
                    FrameID_45 = Frame,
                    V_Frame41 = Temp,
                    V_Frame42 = Temp,
                    V_Frame43 = Temp,
                    V_Frame44 = Temp,
                    V_Frame45 = Temp,
                    STT_Order4 = 0,
                    STT_Frame4 = 0,
                    SL_Frame4 = 0,

                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else if (ID == 5)
            {
                var data = new
                {
                    OrderID5 = Order,
                    FrameID_51 = Frame,
                    FrameID_52 = Frame,
                    FrameID_53 = Frame,
                    FrameID_54 = Frame,
                    FrameID_55 = Frame,
                    V_Frame51 = Temp,
                    V_Frame52 = Temp,
                    V_Frame53 = Temp,
                    V_Frame54 = Temp,
                    V_Frame55 = Temp,
                    STT_Order5 = 0,
                    STT_Frame5 = 0,
                    SL_Frame5 = 0,
                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else
            { }
        }
        public void Write_Order(int ID, string OrderID, int qty, List<DataFrame> frameDataList)
        {
            float[] Temp = new float[5];
            Temp[0] = 0;
            Temp[1] = 0;
            Temp[2] = 0;
            Temp[3] = 0;
            Temp[4] = 0;
            if (ID == 1)
            {
                var data = new
                {
                    OrderID1 = Process_Data.ConvertString(OrderID.ToCharArray(), OrderID.Length),
                    FrameID_11 = Process_Data.ConvertString(frameDataList[0].ID.ToCharArray(), frameDataList[0].ID.Length),
                    FrameID_12 = Process_Data.ConvertString(frameDataList[1].ID.ToCharArray(), frameDataList[1].ID.Length),
                    FrameID_13 = Process_Data.ConvertString(frameDataList[2].ID.ToCharArray(), frameDataList[2].ID.Length),
                    FrameID_14 = Process_Data.ConvertString(frameDataList[3].ID.ToCharArray(), frameDataList[3].ID.Length),
                    FrameID_15 = Process_Data.ConvertString(frameDataList[4].ID.ToCharArray(), frameDataList[4].ID.Length),
                    V_Frame11 = Temp,
                    V_Frame12 = Temp,
                    V_Frame13 = Temp,
                    V_Frame14 = Temp,
                    V_Frame15 = Temp,
                    STT_Order1 = 1,
                    STT_Frame1 = 0,
                    SL_Frame1 = qty,
                    Input_OrderID = 1,


                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else if (ID == 2)
            {
                var data = new
                {
                    OrderID2 = Process_Data.ConvertString(OrderID.ToCharArray(), OrderID.Length),
                    FrameID_21 = Process_Data.ConvertString(frameDataList[0].ID.ToCharArray(), frameDataList[0].ID.Length),
                    FrameID_22 = Process_Data.ConvertString(frameDataList[1].ID.ToCharArray(), frameDataList[1].ID.Length),
                    FrameID_23 = Process_Data.ConvertString(frameDataList[2].ID.ToCharArray(), frameDataList[2].ID.Length),
                    FrameID_24 = Process_Data.ConvertString(frameDataList[3].ID.ToCharArray(), frameDataList[3].ID.Length),
                    FrameID_25 = Process_Data.ConvertString(frameDataList[4].ID.ToCharArray(), frameDataList[4].ID.Length),
                    V_Frame21 = Temp,
                    V_Frame22 = Temp,
                    V_Frame23 = Temp,
                    V_Frame24 = Temp,
                    V_Frame25 = Temp,
                    STT_Order2 = 2,
                    STT_Frame2 = 0,
                    SL_Frame2 = qty,
                    Input_OrderID = 2,

                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else if (ID == 3)
            {
                var data = new
                {
                    OrderID3 = Process_Data.ConvertString(OrderID.ToCharArray(), OrderID.Length),
                    FrameID_31 = Process_Data.ConvertString(frameDataList[0].ID.ToCharArray(), frameDataList[0].ID.Length),
                    FrameID_32 = Process_Data.ConvertString(frameDataList[1].ID.ToCharArray(), frameDataList[1].ID.Length),
                    FrameID_33 = Process_Data.ConvertString(frameDataList[2].ID.ToCharArray(), frameDataList[2].ID.Length),
                    FrameID_34 = Process_Data.ConvertString(frameDataList[3].ID.ToCharArray(), frameDataList[3].ID.Length),
                    FrameID_35 = Process_Data.ConvertString(frameDataList[4].ID.ToCharArray(), frameDataList[4].ID.Length),
                    V_Frame31 = Temp,
                    V_Frame32 = Temp,
                    V_Frame33 = Temp,
                    V_Frame34 = Temp,
                    V_Frame35 = Temp,
                    STT_Order3 = 3,
                    STT_Frame3 = 0,
                    SL_Frame3 = qty,
                    Input_OrderID = 3,

                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else if (ID == 4)
            {
                var data = new
                {
                    OrderID4 = Process_Data.ConvertString(OrderID.ToCharArray(), OrderID.Length),
                    FrameID_41 = Process_Data.ConvertString(frameDataList[0].ID.ToCharArray(), frameDataList[0].ID.Length),
                    FrameID_42 = Process_Data.ConvertString(frameDataList[1].ID.ToCharArray(), frameDataList[1].ID.Length),
                    FrameID_43 = Process_Data.ConvertString(frameDataList[2].ID.ToCharArray(), frameDataList[2].ID.Length),
                    FrameID_44 = Process_Data.ConvertString(frameDataList[3].ID.ToCharArray(), frameDataList[3].ID.Length),
                    FrameID_45 = Process_Data.ConvertString(frameDataList[4].ID.ToCharArray(), frameDataList[4].ID.Length),
                    V_Frame41 = Temp,
                    V_Frame42 = Temp,
                    V_Frame43 = Temp,
                    V_Frame44 = Temp,
                    V_Frame45 = Temp,
                    STT_Order4 = 4,
                    STT_Frame4 = 0,
                    SL_Frame4 = qty,
                    Input_OrderID = 4,

                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else if (ID == 5)
            {
                var data = new
                {
                    OrderID5 = Process_Data.ConvertString(OrderID.ToCharArray(), OrderID.Length),
                    FrameID_51 = Process_Data.ConvertString(frameDataList[0].ID.ToCharArray(), frameDataList[0].ID.Length),
                    FrameID_52 = Process_Data.ConvertString(frameDataList[1].ID.ToCharArray(), frameDataList[1].ID.Length),
                    FrameID_53 = Process_Data.ConvertString(frameDataList[2].ID.ToCharArray(), frameDataList[2].ID.Length),
                    FrameID_54 = Process_Data.ConvertString(frameDataList[3].ID.ToCharArray(), frameDataList[3].ID.Length),
                    FrameID_55 = Process_Data.ConvertString(frameDataList[4].ID.ToCharArray(), frameDataList[4].ID.Length),
                    V_Frame51 = Temp,
                    V_Frame52 = Temp,
                    V_Frame53 = Temp,
                    V_Frame54 = Temp,
                    V_Frame55 = Temp,
                    STT_Order5 = 5,
                    STT_Frame5 = 0,
                    SL_Frame5 = qty,
                    Input_OrderID = 5,
                };
                string jsonData = JsonConvert.SerializeObject(data);
                Write(jsonData);
            }
            else
            { }
        }

        private static string Get_Status_Order(int status)
        {
            string Res = "";
            if (status == 1)
            {
                Res = "Processing";
            }
            else if (status == 2)
            {
                Res = "Done";
            }
            else
            {
                Res = "Unknow";
            }
            return Res;
        }
        public static void Update_DataOrder()
        {
            if (ResPLC.OrderID1 != null && ResPLC.OrderID1 != "")
            {
                DataFrame frameData1 = new DataFrame { ID = ResPLC.FrameID_11, Ass_Height = ResPLC.V_Frame11[0], Drill_Depth = ResPLC.V_Frame11[1], Pin_Error = ResPLC.V_Frame11[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order1[0]) };
                DataFrame frameData2 = new DataFrame { ID = ResPLC.FrameID_12, Ass_Height = ResPLC.V_Frame12[0], Drill_Depth = ResPLC.V_Frame12[1], Pin_Error = ResPLC.V_Frame12[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order1[1]) };
                DataFrame frameData3 = new DataFrame { ID = ResPLC.FrameID_13, Ass_Height = ResPLC.V_Frame13[0], Drill_Depth = ResPLC.V_Frame13[1], Pin_Error = ResPLC.V_Frame13[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order1[2]) };
                DataFrame frameData4 = new DataFrame { ID = ResPLC.FrameID_14, Ass_Height = ResPLC.V_Frame14[0], Drill_Depth = ResPLC.V_Frame14[1], Pin_Error = ResPLC.V_Frame14[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order1[3]) };
                DataFrame frameData5 = new DataFrame { ID = ResPLC.FrameID_15, Ass_Height = ResPLC.V_Frame15[0], Drill_Depth = ResPLC.V_Frame15[1], Pin_Error = ResPLC.V_Frame15[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order1[4]) };
                Data.Log_Data(ResPLC.OrderID1, frameData1, frameData2, frameData3, frameData4, frameData5, Get_Status_Order(ResPLC.Status_Order1), 1);
            }
            if (ResPLC.OrderID2 != null && ResPLC.OrderID2 != "")
            {
                DataFrame frameData1 = new DataFrame { ID = ResPLC.FrameID_21, Ass_Height = ResPLC.V_Frame21[0], Drill_Depth = ResPLC.V_Frame21[1], Pin_Error = ResPLC.V_Frame21[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order2[0]) };
                DataFrame frameData2 = new DataFrame { ID = ResPLC.FrameID_22, Ass_Height = ResPLC.V_Frame22[0], Drill_Depth = ResPLC.V_Frame22[1], Pin_Error = ResPLC.V_Frame22[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order2[1]) };
                DataFrame frameData3 = new DataFrame { ID = ResPLC.FrameID_23, Ass_Height = ResPLC.V_Frame23[0], Drill_Depth = ResPLC.V_Frame23[1], Pin_Error = ResPLC.V_Frame23[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order2[2]) };
                DataFrame frameData4 = new DataFrame { ID = ResPLC.FrameID_24, Ass_Height = ResPLC.V_Frame24[0], Drill_Depth = ResPLC.V_Frame24[1], Pin_Error = ResPLC.V_Frame24[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order2[3]) };
                DataFrame frameData5 = new DataFrame { ID = ResPLC.FrameID_25, Ass_Height = ResPLC.V_Frame25[0], Drill_Depth = ResPLC.V_Frame25[1], Pin_Error = ResPLC.V_Frame25[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order2[4]) };
                Data.Log_Data(ResPLC.OrderID2, frameData1, frameData2, frameData3, frameData4, frameData5, Get_Status_Order(ResPLC.Status_Order2), 2);
            }
            if (ResPLC.OrderID3 != null && ResPLC.OrderID3!="")
            {
                DataFrame frameData1 = new DataFrame { ID = ResPLC.FrameID_31, Ass_Height = ResPLC.V_Frame31[0], Drill_Depth = ResPLC.V_Frame31[1], Pin_Error = ResPLC.V_Frame31[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order3[0]) };
                DataFrame frameData2 = new DataFrame { ID = ResPLC.FrameID_32, Ass_Height = ResPLC.V_Frame32[0], Drill_Depth = ResPLC.V_Frame32[1], Pin_Error = ResPLC.V_Frame32[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order3[1]) };
                DataFrame frameData3 = new DataFrame { ID = ResPLC.FrameID_33, Ass_Height = ResPLC.V_Frame33[0], Drill_Depth = ResPLC.V_Frame33[1], Pin_Error = ResPLC.V_Frame33[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order3[2]) };
                DataFrame frameData4 = new DataFrame { ID = ResPLC.FrameID_34, Ass_Height = ResPLC.V_Frame34[0], Drill_Depth = ResPLC.V_Frame34[1], Pin_Error = ResPLC.V_Frame34[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order3[3]) };
                DataFrame frameData5 = new DataFrame { ID = ResPLC.FrameID_35, Ass_Height = ResPLC.V_Frame35[0], Drill_Depth = ResPLC.V_Frame35[1], Pin_Error = ResPLC.V_Frame35[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order3[4]) };
                Data.Log_Data(ResPLC.OrderID3, frameData1, frameData2, frameData3, frameData4, frameData5, Get_Status_Order(ResPLC.Status_Order3), 3);
            }
            if (ResPLC.OrderID4 != null && ResPLC.OrderID4!="")
            {
                DataFrame frameData1 = new DataFrame { ID = ResPLC.FrameID_41, Ass_Height = ResPLC.V_Frame41[0], Drill_Depth = ResPLC.V_Frame41[1], Pin_Error = ResPLC.V_Frame41[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order4[0]) };
                DataFrame frameData2 = new DataFrame { ID = ResPLC.FrameID_42, Ass_Height = ResPLC.V_Frame42[0], Drill_Depth = ResPLC.V_Frame42[1], Pin_Error = ResPLC.V_Frame42[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order4[1]) };
                DataFrame frameData3 = new DataFrame { ID = ResPLC.FrameID_43, Ass_Height = ResPLC.V_Frame43[0], Drill_Depth = ResPLC.V_Frame43[1], Pin_Error = ResPLC.V_Frame43[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order4[2]) };
                DataFrame frameData4 = new DataFrame { ID = ResPLC.FrameID_44, Ass_Height = ResPLC.V_Frame44[0], Drill_Depth = ResPLC.V_Frame44[1], Pin_Error = ResPLC.V_Frame44[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order4[3]) };
                DataFrame frameData5 = new DataFrame { ID = ResPLC.FrameID_45, Ass_Height = ResPLC.V_Frame45[0], Drill_Depth = ResPLC.V_Frame45[1], Pin_Error = ResPLC.V_Frame45[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order4[4]) };
                Data.Log_Data(ResPLC.OrderID4, frameData1, frameData2, frameData3, frameData4, frameData5, Get_Status_Order(ResPLC.Status_Order4), 4);
            }
            if (ResPLC.OrderID5 != null && ResPLC.OrderID5 != "")
            {
                DataFrame frameData1 = new DataFrame { ID = ResPLC.FrameID_51, Ass_Height = ResPLC.V_Frame51[0], Drill_Depth = ResPLC.V_Frame51[1], Pin_Error = ResPLC.V_Frame51[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order5[0]) };
                DataFrame frameData2 = new DataFrame { ID = ResPLC.FrameID_52, Ass_Height = ResPLC.V_Frame52[0], Drill_Depth = ResPLC.V_Frame52[1], Pin_Error = ResPLC.V_Frame52[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order5[1]) };
                DataFrame frameData3 = new DataFrame { ID = ResPLC.FrameID_53, Ass_Height = ResPLC.V_Frame53[0], Drill_Depth = ResPLC.V_Frame53[1], Pin_Error = ResPLC.V_Frame53[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order5[2]) };
                DataFrame frameData4 = new DataFrame { ID = ResPLC.FrameID_54, Ass_Height = ResPLC.V_Frame54[0], Drill_Depth = ResPLC.V_Frame54[1], Pin_Error = ResPLC.V_Frame54[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order5[3]) };
                DataFrame frameData5 = new DataFrame { ID = ResPLC.FrameID_55, Ass_Height = ResPLC.V_Frame55[0], Drill_Depth = ResPLC.V_Frame55[1], Pin_Error = ResPLC.V_Frame55[2], Status = Get_Status_Order(ResPLC.Status_Frame_Order5[4]) };
                Data.Log_Data(ResPLC.OrderID5, frameData1, frameData2, frameData3, frameData4, frameData5, Get_Status_Order(ResPLC.Status_Order5), 5);
            }

        }
    }
    public class ResPLC
    {
        // Input
        public static int Check_QR_BT { get; set; }
        public static int Check_QR_BT_Done { get; set; }
        public static string OrderID1 { get; set; }
        public static string FrameID_11 { get; set; }
        public static string FrameID_12 { get; set; }
        public static string FrameID_13 { get; set; }
        public static string FrameID_14 { get; set; }
        public static string FrameID_15 { get; set; }
        public static float[] V_Frame11 { get; set; } = new float[5];
        public static float[] V_Frame12 { get; set; } = new float[5];
        public static float[] V_Frame13 { get; set; } = new float[5];
        public static float[] V_Frame14 { get; set; } = new float[5];
        public static float[] V_Frame15 { get; set; } = new float[5];
        public static int[] Status_Frame_Order1 { get; set; } = new int[5];
        public static int Status_Order1 { get; set; }
        //
        public static string OrderID2 { get; set; }
        public static string FrameID_21 { get; set; }
        public static string FrameID_22 { get; set; }
        public static string FrameID_23 { get; set; }
        public static string FrameID_24 { get; set; }
        public static string FrameID_25 { get; set; }
        public static float[] V_Frame21 { get; set; } = new float[5];
        public static float[] V_Frame22 { get; set; } = new float[5];
        public static float[] V_Frame23 { get; set; } = new float[5];
        public static float[] V_Frame24 { get; set; } = new float[5];
        public static float[] V_Frame25 { get; set; } = new float[5];
        public static int[] Status_Frame_Order2 { get; set; } = new int[5];
        public static int Status_Order2 { get; set; }
        //
        public static string OrderID3 { get; set; }
        public static string FrameID_31 { get; set; }
        public static string FrameID_32 { get; set; }
        public static string FrameID_33 { get; set; }
        public static string FrameID_34 { get; set; }
        public static string FrameID_35 { get; set; }
        public static float[] V_Frame31 { get; set; } = new float[5];
        public static float[] V_Frame32 { get; set; } = new float[5];
        public static float[] V_Frame33 { get; set; } = new float[5];
        public static float[] V_Frame34 { get; set; } = new float[5];
        public static float[] V_Frame35 { get; set; } = new float[5];
        public static int[] Status_Frame_Order3 { get; set; } = new int[5];
        public static int Status_Order3 { get; set; }
        //
        public static string OrderID4 { get; set; }
        public static string FrameID_41 { get; set; }
        public static string FrameID_42 { get; set; }
        public static string FrameID_43 { get; set; }
        public static string FrameID_44 { get; set; }
        public static string FrameID_45 { get; set; }
        public static float[] V_Frame41 { get; set; } = new float[5];
        public static float[] V_Frame42 { get; set; } = new float[5];
        public static float[] V_Frame43 { get; set; } = new float[5];
        public static float[] V_Frame44 { get; set; } = new float[5];
        public static float[] V_Frame45 { get; set; } = new float[5];
        public static int[] Status_Frame_Order4 { get; set; } = new int[5];
        public static int Status_Order4 { get; set; }
        //
        public static string OrderID5 { get; set; }
        public static string FrameID_51 { get; set; }
        public static string FrameID_52 { get; set; }
        public static string FrameID_53 { get; set; }
        public static string FrameID_54 { get; set; }
        public static string FrameID_55 { get; set; }
        public static float[] V_Frame51 { get; set; } = new float[5];
        public static float[] V_Frame52 { get; set; } = new float[5];
        public static float[] V_Frame53 { get; set; } = new float[5];
        public static float[] V_Frame54 { get; set; } = new float[5];
        public static float[] V_Frame55 { get; set; } = new float[5];
        public static int[] Status_Frame_Order5 { get; set; } = new int[5];
        public static int Status_Order5 { get; set; }
        //
        //
        public static int Assy_status { get; set; }
    }

}
