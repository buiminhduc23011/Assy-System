using Assy_System_UI.Class;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Threading;
using System.Net.NetworkInformation;
using SocketIOClient;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.IO;
using System.Windows.Media;
using Assy_System_UI.UserControl;
using System.Text.Json;
using Newtonsoft.Json;
using MaterialDesignThemes.Wpf;
using Newtonsoft.Json.Linq;
using System.Windows.Shapes;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;

namespace Assy_System_UI
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>

    public partial class MainWindow : Window
    {
        //Pannel
        Production Pn_Production = new Production();
        Setting Pn_Setting = new Setting();
        //
        PLC PLC = new PLC();
        Data Data = new Data();
        PerformanceCounter cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
        private CancellationTokenSource _cancellationTokenSource;
        private bool areTasksInitialized = false;
        private List<Task> tasks = new List<Task>();
        //Socket IO
        public bool Connected_Socket = false;
        string host_socket;
        SocketIO socketclient;
        private bool Sendmac = false;
        //TCP Server
        public bool Is_TCPServer = false;
        private TcpListener tcpListener;
        private List<TcpClient> connectedClients = new List<TcpClient>();
        private object lockObject = new object();
        string[] Source_CameraBT;
        string[] Source_CameraLV;
        //Data Order
        private string OrderID;
        //Status Device
        private bool Is_QR1;
        private bool Is_QR2;
        private int assy_status_temp = 0;
        //

        public static string GetMacAddress()
        {

            string macAddress = "";
            foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (nic.OperationalStatus == OperationalStatus.Up && !nic.Description.ToLower().Contains("virtual") && !nic.Description.ToLower().Contains("pseudo"))
                {
                    if (nic.NetworkInterfaceType == NetworkInterfaceType.Wireless80211) // Check if it's a Wi-Fi interface
                    {
                        byte[] macBytes = nic.GetPhysicalAddress().GetAddressBytes();
                        macAddress = string.Join(":", macBytes.Select(b => b.ToString("X2")));
                        break;
                    }
                }
            }
            return macAddress;
        }
        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
            Closing += MainWindow_Closing;
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            Common.Load_Setting();
            //
            Source_CameraBT = Common.Sys_CameraBT.Split(':');
            Source_CameraLV = Common.Sys_CameraLV.Split(':');
            //
            host_socket = "http://" + Common.Sys_Server_Web;
            if (!areTasksInitialized)
            {
                _cancellationTokenSource = new CancellationTokenSource();
                tasks.Add(Task.Run(() => Update_UI(_cancellationTokenSource.Token)));
                tasks.Add(Task.Run(() => Socket_IO_Tasks(_cancellationTokenSource.Token)));
                tasks.Add(Task.Run(() => TCP_Server_Tasks(_cancellationTokenSource.Token)));
                tasks.Add(Task.Run(() => CheckData_Tasks(_cancellationTokenSource.Token)));
                areTasksInitialized = true;
            }
            Pannel_Monitor.Children.Add(Pn_Production);
            bt_Production.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            //Remove_Data("Ducne");
            PLC.Start();
            for(int i = 1;i<6;i++)
            {
                PLC.Delete_Order(i);
            }    
            
            
        }
        private void MainWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            PLC.Stop();
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
        private async void Update_UI(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                Dispatcher.Invoke(() =>
                {
                    System.DateTime dateTime = System.DateTime.Now;
                    string formattedDate = dateTime.ToString("dd/MM/yyyy");
                    lb_Day.Content = formattedDate;
                    string formattedtime = dateTime.ToString("HH:mm:ss");
                    lb_Time.Content = formattedtime;
                    //
                    float cpuUsage = cpuCounter.NextValue();
                    string formattedCpuUsage = cpuUsage.ToString("F2") + "%";
                    Per_CPU.Content = formattedCpuUsage;

                    //
                    if (Connected_Socket)
                    {
                        Status_Server.Content = "Contented";
                        Status_Server.Background = System.Windows.Media.Brushes.Green;
                    }
                    else
                    {
                        Status_Server.Content = "DisContented";
                        Status_Server.Background = System.Windows.Media.Brushes.Red;
                    }
                    //
                    if (Is_QR1)
                    {
                        Status_QRcode_Conv.Content = "Contented";
                        Status_QRcode_Conv.Background = System.Windows.Media.Brushes.Green;
                    }
                    else
                    {
                        Status_QRcode_Conv.Content = "DisContented";
                        Status_QRcode_Conv.Background = System.Windows.Media.Brushes.Red;
                    }
                    if (Is_QR2)
                    {
                        Status_QRcode.Content = "Contented";
                        Status_QRcode.Background = System.Windows.Media.Brushes.Green;
                    }
                    else
                    {
                        Status_QRcode.Content = "DisContented";
                        Status_QRcode.Background = System.Windows.Media.Brushes.Red;
                    }
                });
                await Task.Delay(1000);
            }
        }
        private async void Socket_IO_Tasks(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    if (!Connected_Socket)
                    {
                        socketclient = new SocketIO(host_socket);
                        await socketclient.ConnectAsync();
                        Connected_Socket = true;
                    }
                    if (Sendmac == false && Connected_Socket == true)
                    {
                        var mac = new
                        {
                            mac = GetMacAddress(),
                        };
                        await socketclient.EmitAsync("connect-machine", mac);
                        Sendmac = true;
                    }
                    socketclient.OnConnected += (eventSender, eventArgs) =>
                    {
                        Connected_Socket = true;
                    };

                    socketclient.OnDisconnected += (eventSender, eventArgs) =>
                    {
                        Connected_Socket = false;
                        Sendmac = false;
                    };
                    //Send
                    if (OrderID != Production.OrderID)
                    {
                        OrderID = Production.OrderID;
                        if (OrderID != "")
                        {
                            if (!Data.is_Order_Free(OrderID))
                            {
                                var Order_ID = new
                                {
                                    mac = GetMacAddress(),
                                    order = OrderID,
                                };
                                await socketclient.EmitAsync("assy-get-data-order", Order_ID);
                            }
                            else
                            {
                               //Nothing
                            }
                        }
                    }
                    if(ResPLC.Assy_status != 0) 
                    {
                        if(assy_status_temp!= ResPLC.Assy_status) 
                        {
                            var Assy_Status = new
                            {
                                mac = GetMacAddress(),
                                assy_status = ResPLC.Assy_status,
                            };
                            await socketclient.EmitAsync("assy-status", Assy_Status);
                            assy_status_temp = ResPLC.Assy_status;
                        }
                        
                    }
                    //Rev
                        socketclient.On("assy-get-data-order", response =>
                    {
                        string res = response.ToString();
                        if (res != null)
                        {
                            JArray jsonArray = JArray.Parse(res);

                            if (bool.Parse(jsonArray[0]["status"].ToString()))
                            {
                                int qty = int.Parse(jsonArray[0]["qty"].ToString());
                                List<DataFrame> frameDataList = new List<DataFrame>();
                                string OrderID_ = jsonArray[0]["order_id"].ToString();
                                for (int i = 0; i < 5; i++)
                                {
                                    if (i <= qty)
                                    {
                                        DataFrame frameData = new DataFrame { ID = jsonArray[0]["frame_id"].ToString(), Ass_Height = 0, Drill_Depth = 0, Pin_Error = 0, Status = "Unknown" };
                                        frameDataList.Add(frameData);
                                    }
                                    else
                                    {
                                        DataFrame frameData = new DataFrame { ID = "", Ass_Height = 0, Drill_Depth = 0, Pin_Error = 0, Status = "Unknown" };
                                        frameDataList.Add(frameData);
                                    }
                                }
                                int ID = Data.Get_Id();
                                Data.Log_Data(OrderID_, frameDataList[0], frameDataList[1], frameDataList[2], frameDataList[3], frameDataList[4], "Processing",ID);
                                PLC.Write_Order(ID, OrderID_, qty, frameDataList);
                            }
                            else
                            {
                                MessageBox.Show("Order Không Tồn Tại");
                            }
                        }
                    });
                    socketclient.On("assy-push-data-production", response =>
                    {
                        string res = response.ToString();
                        if (res != null)
                        {
                            JArray jsonArray = JArray.Parse(res);
                            if (bool.Parse(jsonArray[0]["status"].ToString()))
                            {
                                PLC.Delete_Order(int.Parse(jsonArray[0]["ID"].ToString()));
                                Data.Remove_Data(jsonArray[0]["OrderID"].ToString());
                            }
                        }
                    });
                    socketclient.On("cmd-agv-status", response =>
                    {
                    string res = response.ToString();
                    if (res != null)
                    {
                        JArray jsonArray = JArray.Parse(res);
                            var data = new
                            {

                                agv_status = int.Parse(jsonArray[0]["cmd_agv_status"].ToString()),
                            };
                            string jsonData = JsonConvert.SerializeObject(data);
                            PLC.Write5(jsonData);
                           // MessageBox.Show("OK");
                        }
                    });
                }
                catch
                {
                    //  MessageBox.Show($"Socket_IO_Tasks: {ex.Message}");
                }
                await Task.Delay(100);
            }
        }
        private async void TCP_Server_Tasks(CancellationToken cancellationToken)
        {
            tcpListener = new TcpListener(IPAddress.Any, 5001); // Specify the desired port
            tcpListener.Start();

            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    if (tcpListener.Pending())
                    {
                        TcpClient client = await tcpListener.AcceptTcpClientAsync();
                        Task.Run(() => HandleClient(client));
                    }

                    await Task.Delay(100);
                }
            }
            catch
            {
              //  MessageBox.Show($"TCP_Server_Tasks: {ex.Message}");
            }
            finally
            {
                tcpListener.Stop();
            }
        }

        private void HandleClient(TcpClient client)
        {
            try
            {
                lock (lockObject)
                {
                    connectedClients.Add(client);
                }

                IPAddress clientIPAddress = ((IPEndPoint)client.Client.RemoteEndPoint).Address;
                //MessageBox.Show($"Client connected from IP address: {clientIPAddress}");


                if (clientIPAddress.ToString() == Source_CameraBT[0]) { Is_QR1 = true; }
                if (clientIPAddress.ToString() == Source_CameraLV[0]) { Is_QR2 = true; }
                NetworkStream stream = client.GetStream();

                while (client.Connected)
                {
                    byte[] buffer = new byte[1024];
                    int bytesRead = stream.Read(buffer, 0, buffer.Length);
                    if (bytesRead > 0)
                    {
                        string receivedData = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                        if (receivedData == "OK_BT")
                        {
                            IPAddress targetIPAddress1 = IPAddress.Parse(Source_CameraBT[0]);
                            SendDataToClient("Qr_BT_Check", targetIPAddress1);
                        }
                        if (receivedData == "OK_LV")
                        {
                            IPAddress targetIPAddress1 = IPAddress.Parse(Source_CameraLV[0]);
                            SendDataToClient("Qr_LV_Check", targetIPAddress1);
                        }
                    }
                    else
                    {
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"HandleClient: {ex.Message}");
            }
            finally
            {
                lock (lockObject)
                {
                    connectedClients.Remove(client);
                }
                IPAddress clientIPAddress = ((IPEndPoint)client.Client.RemoteEndPoint).Address;
                if (clientIPAddress.ToString() == Source_CameraBT[0]) { Is_QR1 = false; }
                if (clientIPAddress.ToString() == Source_CameraLV[0]) { Is_QR2 = false; }
                client.Close();

            }
        }
        private void SendDataToClient(string data, IPAddress targetIPAddress)
        {
            byte[] dataBytes = Encoding.UTF8.GetBytes(data);

            lock (lockObject)
            {
                // Find the target client with the specified IP address
                TcpClient targetClient = connectedClients.FirstOrDefault(c => ((IPEndPoint)c.Client.RemoteEndPoint).Address.Equals(targetIPAddress));

                if (targetClient != null)
                {
                    try
                    {
                        NetworkStream stream = targetClient.GetStream();
                        stream.Write(dataBytes, 0, dataBytes.Length);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show($"SendDataToClient: {ex.Message}");
                    }
                }
                else
                {
                    MessageBox.Show($"SendDataToClient: {targetIPAddress} not found.");
                }
            }
        }
        private async void CheckData_Tasks(CancellationToken cancellationToken)
        {

            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    if (Connected_Socket)
                    {
                        CheckData_OrderDone();
                    }
                    PLC.Update_DataOrder();
                    await Task.Delay(1000);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"CheckData_Tasks: {ex.Message}");
            }
        }
        private async void CheckData_OrderDone()
        {
            try
            {
                string json = File.ReadAllText(Path_IO.DataOrder);
                var options = new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip };
                var data = System.Text.Json.JsonSerializer.Deserialize<Data[]>(json, options);
                var removeData = new List<Data>();
                foreach (var item in data)
                {
                    if (item.Status == "Done")
                    {
                        removeData.Add(item);
                        var mac = new
                        {
                            mac = GetMacAddress(),
                            Data = removeData,
                        };
                        await socketclient.EmitAsync("assy-push-data-production", mac);
                        break;
                    }
                }
            }
            catch { }
        }
        private void bt_Production_Click(object sender, RoutedEventArgs e)
        {
            Pannel_Monitor.Children.Clear();
            Pannel_Monitor.Children.Add(Pn_Production);
            bt_Production.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            bt_setting.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
        }
        private void bt_setting_Click(object sender, RoutedEventArgs e)
        {
            Pannel_Monitor.Children.Clear();
            Pannel_Monitor.Children.Add(Pn_Setting);
            bt_setting.Background = new SolidColorBrush(Color.FromRgb(100, 149, 237));
            bt_Production.Background = new SolidColorBrush(Color.FromRgb(255, 255, 255));
        }
    }
}
