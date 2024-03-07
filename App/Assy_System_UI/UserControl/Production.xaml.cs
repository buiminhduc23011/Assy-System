using Assy_System_UI.Class;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;


namespace Assy_System_UI.UserControl
{
    /// <summary>
    /// Interaction logic for Production.xaml
    /// </summary>
    public class ListOrder
    {
        public string OrderID { get; set; }
        public int STT { get; set; }
        public ListOrder(int STT_, string OrderID_)
        {
            STT = STT_;
            OrderID = OrderID_;
        }
    }
    public partial class Production
    {
        public static string OrderID = String.Empty;
        private CancellationTokenSource _cancellationTokenSource;
        private bool areTasksInitialized = false;
        private List<Task> tasks = new List<Task>();
        //
        Data Data = new Data();
        public Production()
        {
            InitializeComponent();
            Loaded += Production_Loaded;
            Unloaded += Production_Unloaded;
        }
        private void Production_Loaded(object sender, RoutedEventArgs e)
        {
            if (!areTasksInitialized)
            {
                _cancellationTokenSource = new CancellationTokenSource();
                tasks.Add(Task.Run(() => Update_UI(_cancellationTokenSource.Token)));
                areTasksInitialized = true;
            }
            foreach (var dataGrid in Common.FindVisualChildren<DataGrid>(this))
            {
                dataGrid.SelectionChanged += DataGrid_SelectionChanged;
            }
        }
        private void DataGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            string gridName = ((DataGrid)sender).Name;

            if (gridName == "List_Order")
            {
                var selectedRow = List_Order.SelectedItem as DataView;
                if (selectedRow != null)
                {
                    var data = selectedRow.OrderID;
                    txbOrderID.Text = data.ToString();
                }
            }

        }
        private void Production_Unloaded(object sender, RoutedEventArgs e)
        {
            CancelAllTasks();
        }
        public void CancelAllTasks()
        {
            _cancellationTokenSource.Cancel();
            foreach (var task in tasks)
            {
                task.Wait();
            }
        }
        private void txbOrderID_TextChanged(object sender, TextChangedEventArgs e)
        {
            OrderID = txbOrderID.Text.Trim();
        }
        private async void Update_UI(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                Dispatcher.Invoke(() =>
                {
                    Show_Order();
                });
                await Task.Delay(1000);
            }
        }
        private void Show_Order()
        {
            try
            {
                List<DataView> listData = new List<DataView>();
                string List_Data = File.ReadAllText(Path_IO.DataOrder);
                if (List_Data.Length > 0)
                {
                    JArray List_Show = JArray.Parse(List_Data);
                    foreach (JObject obj in List_Show)
                    {
                        listData.Add(new DataView
                        {
                            ID = (int)obj["ID"],
                            OrderID = (string)obj["OrderID"],
                            Status = (string)obj["Status"],
                            FrameData_1 = Data.ExtractFrameData(obj, "FrameData_1"),
                            FrameData_2 = Data.ExtractFrameData(obj, "FrameData_2"),
                            FrameData_3 = Data.ExtractFrameData(obj, "FrameData_3"),
                            FrameData_4 = Data.ExtractFrameData(obj, "FrameData_4"),
                            FrameData_5 = Data.ExtractFrameData(obj, "FrameData_5")
                        });
                    }
                    List_Order.ItemsSource = listData;
                }
            }
            catch { }

        }

        private void bt_Delete_Click(object sender, RoutedEventArgs e)
        {
            Data.Remove_Data(txbOrderID.Text);
        }
    }
}
