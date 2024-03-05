using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.IO;
using Newtonsoft.Json;
using System.Windows;

namespace Assy_System_UI.Class
{
    public class Data
    {
        PLC plc = new PLC();
        public string OrderID { get; set; }
        public string Status { get; set; }
        public int ID { get; set; }
        public DataFrame FrameData_1 { get; set; }
        public DataFrame FrameData_2 { get; set; }
        public DataFrame FrameData_3 { get; set; }
        public DataFrame FrameData_4 { get; set; }
        public DataFrame FrameData_5 { get; set; }
        public Data()
        {
            FrameData_1 = new DataFrame();
            FrameData_2 = new DataFrame();
            FrameData_3 = new DataFrame();
            FrameData_4 = new DataFrame();
            FrameData_5 = new DataFrame();
        }
        public static DataFrame ExtractFrameData(JObject obj, string frameKey)
        {
            JObject frameData = (JObject)obj[frameKey];

            return new DataFrame
            {
                ID = (string)frameData["ID"],
                Ass_Height = (double)frameData["Ass_Height"],
                Drill_Depth = (double)frameData["Drill_Depth"],
                Pin_Error = (double)frameData["Pin_Error"],
                Status = (string)frameData["Status"]
            };
        }
        public static void Log_Data(string OrderID, DataFrame Frame1, DataFrame Frame2, DataFrame Frame3, DataFrame Frame4, DataFrame Frame5, String Status, int ID)
        {
            Data Data = new Data();
            Data.OrderID = OrderID;
            Data.Status = Status;
            Data.ID = ID;
            Data.FrameData_1 = Frame1;
            Data.FrameData_2 = Frame2;
            Data.FrameData_3 = Frame3;
            Data.FrameData_4 = Frame4;
            Data.FrameData_5 = Frame5;

            string Data_Json = JsonConvert.SerializeObject(Data);
            //
            try
            {
                string json = File.ReadAllText(Path_IO.DataOrder);
                var options = new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip };
                var data = System.Text.Json.JsonSerializer.Deserialize<DataTemp[]>(json, options);
                float flag = 0;
                foreach (var item in data)
                {
                    if (item.OrderID == OrderID)
                    {
                        item.Status = Status;
                        item.FrameData_1 = Frame1;
                        item.FrameData_2 = Frame2;
                        item.FrameData_3 = Frame3;
                        item.FrameData_4 = Frame4;
                        item.FrameData_5 = Frame5;
                        var jsonOptions = new JsonSerializerOptions { WriteIndented = true };
                        string newJsonString = System.Text.Json.JsonSerializer.Serialize(data, jsonOptions);
                        // Write back to file
                        File.WriteAllText(Path_IO.DataOrder, newJsonString);
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0)
                {
                    if (json != "[]")
                    {
                        json = json.Remove(json.Length - 1);
                        json = json + "," + Data_Json + "]";
                        File.WriteAllText(Path_IO.DataOrder, json);
                    }
                    else
                    {
                        json = json.Remove(json.Length - 1);
                        json = json + Data_Json + "]";
                        File.WriteAllText(Path_IO.DataOrder, json);
                    }

                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }
        public static bool is_Order_Free(string OrderID)
        {
            bool Result = false;
            try
            {
                string json = File.ReadAllText(Path_IO.DataOrder);
                var options = new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip };
                var data = System.Text.Json.JsonSerializer.Deserialize<DataTemp[]>(json, options);
                foreach (var item in data)
                {
                    if (item.OrderID == OrderID)
                    {
                        Result = true;
                        break;
                    }
                    else
                    {
                        Result = false;
                    }
                }
            }
            catch { }
            return Result;
        }
        public static int Get_Id()
        {
            int ID = 0;
            string List_Data = File.ReadAllText(Path_IO.DataOrder);
            var options = new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip };
            var data = System.Text.Json.JsonSerializer.Deserialize<DataTemp[]>(List_Data, options);
            if (List_Data.Length > 0)
            {
                if (List_Data == "[]")
                {
                    ID = 1;
                }
                else
                {
                    List<int> existingIds = new List<int>();
                    JArray List_Show = JArray.Parse(List_Data);
                    ID = List_Show.Count + 1;
                    foreach (var item in data)
                    {
                        int id = item.ID;
                        // Kiểm tra xem ID đã tồn tại trong danh sách chưa
                        if (!existingIds.Contains(id))
                        {
                            existingIds.Add(id);
                        }
                    }
                    for (int i = 1; i <= 5; i++)
                    {
                        if (existingIds.Contains(i))
                        {

                        }
                        else
                        {
                            ID = i;
                            break;
                        }
                    }
                }
            }
            else
            {
                ID = 1;
            }
            return ID;
        }
        public void Remove_Data(string OrderID)
        {
            string json = File.ReadAllText(Path_IO.DataOrder);
            var options = new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip };
            var data = System.Text.Json.JsonSerializer.Deserialize<DataTemp[]>(json, options);
            var newData = new List<DataTemp>();

            foreach (var item in data)
            {
                if (item.OrderID != OrderID)
                {
                    newData.Add(item);
                }
                else
                {
                    plc.Delete_Order(item.ID);
                }
            }
            var jsonOptions = new JsonSerializerOptions { WriteIndented = true };
            string newJsonString = System.Text.Json.JsonSerializer.Serialize(newData, jsonOptions);
            // Write back to file
            File.WriteAllText(Path_IO.DataOrder, newJsonString);
        }
    }
    public class DataTemp
    {
        public string OrderID { get; set; }
        public string Status { get; set; }
        public int ID { get; set; }
        public DataFrame FrameData_1 { get; set; }
        public DataFrame FrameData_2 { get; set; }
        public DataFrame FrameData_3 { get; set; }
        public DataFrame FrameData_4 { get; set; }
        public DataFrame FrameData_5 { get; set; }
        public DataTemp()
        {
            FrameData_1 = new DataFrame();
            FrameData_2 = new DataFrame();
            FrameData_3 = new DataFrame();
            FrameData_4 = new DataFrame();
            FrameData_5 = new DataFrame();
        }
    }
    
    public class DataView
    {
        public int ID { get; set; }
        public string OrderID { get; set; }
        public string Status { get; set; }
        public DataFrame FrameData_1 { get; set; }
        public DataFrame FrameData_2 { get; set; }
        public DataFrame FrameData_3 { get; set; }
        public DataFrame FrameData_4 { get; set; }
        public DataFrame FrameData_5 { get; set; }
        public DataView()
        {
            FrameData_1 = new DataFrame();
            FrameData_2 = new DataFrame();
            FrameData_3 = new DataFrame();
            FrameData_4 = new DataFrame();
            FrameData_5 = new DataFrame();
        }
    }
    public class DataFrame
    {
        public string ID { get; set; }
        public double Ass_Height { get; set; }
        public double Drill_Depth { get; set; }
        public double Pin_Error { get; set; }
        public string Status { get; set; }
    }
    
}
