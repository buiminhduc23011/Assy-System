using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows;
using System.Text.Json;

namespace Assy_System_UI.Class
{
    public static class Common
    {
        public static string Sys_CameraBT;
        public static string Sys_CameraLV;
        public static string Sys_PLC_R;
        public static string Sys_PLC_W;
        public static string Sys_Server_Web;

        public static void Load_Setting()
        {
            try
            {
                string jsonContent = System.IO.File.ReadAllText(Path_IO.SettingSys);
                JsonDocument jsonDocument = JsonDocument.Parse(jsonContent);
                JsonElement device = jsonDocument.RootElement;
                Sys_CameraBT = device.GetProperty("Camera_BT").GetString();
                Sys_CameraLV = device.GetProperty("Camera_BT").GetString();
                Sys_PLC_R = device.GetProperty("Server_PLC_R").GetString();
                Sys_PLC_W = device.GetProperty("Server_PLC_W").GetString();
                Sys_Server_Web = device.GetProperty("Server_Web").GetString();

            }
            catch { }
        }
        public static IEnumerable<T> FindVisualChildren<T>(DependencyObject parent) where T : DependencyObject
        {
            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(parent); i++)
            {
                var child = VisualTreeHelper.GetChild(parent, i);
                if (child != null && child is T)
                {
                    yield return (T)child;
                }
                else
                {
                    var result = FindVisualChildren<T>(child);
                    if (result != null)
                    {
                        foreach (var item in result)
                        {
                            yield return item;
                        }
                    }
                }
            }
        }
        

    }
    public static class Path_IO
    {
        public static string DataOrder = System.IO.Path.Combine("Path", "Test.json");
        public static string SettingSys = System.IO.Path.Combine("Path", "Setting_Sys.ini");
    }
}
