// server.js
const fs = require("fs");

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

function logToFile(message) {
  const timestamp = new Date().toLocaleString();
  const logMessage = `[${timestamp}] ${message}\n`;

  try {
    fs.writeFileSync("Test_Connect.txt", logMessage, { flag: 'a+' }); // 'a+' để append và tạo file nếu nó không tồn tại
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
}


io.on("connection", (socket) => {
  console.log("Client connected");
  logToFile("Client connected");
  socket.emit("message", "Welcome to the server!");

  // Lắng nghe sự kiện 'sendMessage' từ client và broadcast đến tất cả client
  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  // Lắng nghe sự kiện 'disconnect' khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    logToFile("Client disconnected");
  });
  socket.on("connect-machine", (data) => {
    console.log("IoT device connected:", data);
  });
  socket.on("get-data-order", (data) => {
    console.log("get-data-order:", data);
    io.emit('get-data-order', data);
  });
  socket.on("err-machine-status", (data) => {
    console.log("Machine_Error:", data);
  });
  socket.on("update-report-product-quality", (data) => {
    console.log("Report_Quality:", data);
  });
  socket.on("Call-AGV", (data) => {
    console.log("Call-AGV:", data);
  });
  socket.on("update-cavity", (data) => {
    console.log("update-cavity:", data);
  });
  socket.on("Next-Plan", (data) => {
    console.log("Next-Plan:", data);
  });
  socket.on("Back-Plan", (data) => {
    console.log("Back-Plan:", data);
  });
  socket.on("Start-Plan", (data) => {
    console.log("Start-Plan:", data);
  });
  socket.on("Stop-Plan", (data) => {
    console.log("Stop-Plan:", data);
  });
  socket.on("assy-send-frame_id", (data) => {
    console.log("assy-send-frame_id", data);
    const order = {
      order_id: generateRandomString(10),
      frame_id: data.frame_id,
      product_id: generateRandomString(20),
    };
    const data_ = {
      status: true,
      data: order, // Use a colon (:) here instead of an equal sign (=)
    };
    console.log(data_);
    io.emit('assy-send-frame_id', data_);
  });
  socket.on("assy-success-production", (data) => {
    console.log("assy-success-production:", data);
  });
  socket.on("assy-status", (data) => {
    console.log("assy-status':", data);
  });
});
// setInterval(() => {
//     const data = { status : true,
//      };
//      console.log(data);
//     io.emit('assy-start-order', data);

// }, 1000);
// setInterval(() => {
//   const data_ = {
//     cmd_agv_status: Math.floor(Math.random() * 10),
//   };
//   console.log(data_);
//   io.emit('cmd-agv-status', data_);

// }, 5000);

// setInterval(() => {
//   const data_ = { status : true, last_order :true,
//   };
//   console.log(data_);
//  io.emit('assy-success-production', data_);

// }, 2000);
// setInterval(() => {
//      const plan = {
//         Plan_Id: Math.floor(Math.random() * 1000),
//         ProductId_1: 'hfdsj',
//         MoldId_1: generateRandomString(20),
//         MaterialID_1: generateRandomString(20),
//         Cavity_1: Math.floor(Math.random() * 10),
//         ProductId_2: generateRandomString(20),
//         MoldId_2: generateRandomString(20),
//         MaterialID_2: generateRandomString(20),
//         Cavity_2: Math.floor(Math.random() * 10),
//         Quantity_of_raw_materials: Math.floor(Math.random() * 100),
//         Quantity_of_raw_materials_in_stock: Math.floor(Math.random() * 100),
//         cycle_time: Math.floor(Math.random() * 50),
//         Minimum_raw_materials: Math.floor(Math.random() * 20),
//         Status_Plan: Math.floor(Math.random() * 3), 
//     };
//     console.log("plan-production:", plan);
//     io.emit('plan-production', plan);
// }, 10000);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  logToFile("Server Is Start");
});
function generateRandomString(maxLength) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = Math.floor(Math.random() * maxLength) + 1; // +1 để đảm bảo có ít nhất một ký tự
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}