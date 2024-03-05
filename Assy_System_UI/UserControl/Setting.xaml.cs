using Assy_System_UI.Class;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.IO;
using Newtonsoft.Json;
using System.Text.Json;

namespace Assy_System_UI.UserControl
{
    /// <summary>
    /// Interaction logic for Setting.xaml
    /// </summary>
    public partial class Setting
    {
        public Setting()
        {
            InitializeComponent();
            Loaded += Setting_Loaded;
            Unloaded += Setting_Unloaded;
        }
        private void Setting_Loaded(object sender, RoutedEventArgs e)
        {
            Show_Data_Setting();
        }
        private void Setting_Unloaded(object sender, RoutedEventArgs e)
        {

        }
        private void Show_Data_Setting()
        {
            try
            {
                string[] CameraBT = Common.Sys_CameraBT.Split(':');
                string[] CameraLV = Common.Sys_CameraLV.Split(':');
                txb_IP_CameraBT.Text = CameraBT[0];
                txb_Port_CameraBT.Text = CameraBT[1];
                txb_IP_CameraLV.Text = CameraLV[0];
                txb_Port_CameraLV.Text = CameraLV[1];
                txb_ServerPLC_R.Text = Common.Sys_PLC_R;
                txb_ServerPLC_W.Text = Common.Sys_PLC_W;
                txb_ServerWeb.Text = Common.Sys_Server_Web;   
            }
            catch { }
        }
        private void bt_Save_Setting_Sys_Click(object sender, RoutedEventArgs e)
        {

            object data_Setting = new
            {
                Camera_BT = txb_IP_CameraBT.Text + ":" + txb_Port_CameraBT.Text,
                Camera_LV = txb_IP_CameraLV.Text + ":" + txb_Port_CameraLV.Text,
                Server_PLC_R = txb_ServerPLC_R.Text,
                Server_PLC_W = txb_ServerPLC_W.Text,
                Server_Web = txb_ServerWeb.Text,
            };
            string json = System.Text.Json.JsonSerializer.Serialize(data_Setting);
            File.WriteAllText(Path_IO.SettingSys, json);
            MessageBox.Show("Đã Lưu Thành Công");
            //
        }
    }
}
