using Assy_System_UI.Class;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Xml.Linq;

namespace Assy_System_UI.UserControl
{
    /// <summary>
    /// Interaction logic for GPIO.xaml
    /// </summary>
    public partial class GPIO
    {
        IO_BT Pn_IO_BT = new IO_BT();
        IO_LV Pn_IO_LV = new IO_LV();
        IO_Drill Pn_IO_Drill = new IO_Drill();
        IO_DC Pn_IO_DC = new IO_DC();
        IO_Output Pn_IO_Output = new IO_Output();
        public GPIO()
        {
            InitializeComponent();
            Loaded += GPIO_Loaded;
            Unloaded += GPIO_Unloaded;
        }
        private void GPIO_Loaded(object sender, RoutedEventArgs e)
        {
            Pn_GPIO.Children.Add(Pn_IO_BT);
            bt_IO_BT.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            bt_IO_LV.Background = new SolidColorBrush(Color.FromRgb(255, 255,255));
            bt_IO_Drill.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_DC.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Output.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
        }
        private void GPIO_Unloaded(object sender, RoutedEventArgs e)
        {
            Pn_GPIO.Children.Clear();
        }
        private void bt_IO_BT_Click(object sender, RoutedEventArgs e)
        {
            Pn_GPIO.Children.Clear();
            Pn_GPIO.Children.Add(Pn_IO_BT);
            bt_IO_BT.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            bt_IO_LV.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Drill.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_DC.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Output.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
        }

        private void bt_IO_LV_Click(object sender, RoutedEventArgs e)
        {
            Pn_GPIO.Children.Clear();
            Pn_GPIO.Children.Add(Pn_IO_LV);
            bt_IO_LV.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            bt_IO_BT.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Drill.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_DC.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Output.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
        }

        private void bt_IO_Drill_Click(object sender, RoutedEventArgs e)
        {
            Pn_GPIO.Children.Clear();
            Pn_GPIO.Children.Add(Pn_IO_Drill);
            bt_IO_Drill.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            bt_IO_LV.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_BT.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_DC.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Output.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
        }

        private void bt_IO_DC_Click(object sender, RoutedEventArgs e)
        {
            Pn_GPIO.Children.Clear();
            Pn_GPIO.Children.Add(Pn_IO_DC);
            bt_IO_DC.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            bt_IO_LV.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Drill.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_BT.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Output.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
        }

        private void bt_IO_Output_Click(object sender, RoutedEventArgs e)
        {
            Pn_GPIO.Children.Clear();
            Pn_GPIO.Children.Add(Pn_IO_Output);
            bt_IO_Output.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            bt_IO_LV.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_Drill.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_DC.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
            bt_IO_BT.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
        }
    }
}
