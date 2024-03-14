const net = require('net');
const { MAC } = require('./configs');
const {socket } = require('./Socket');

const server = net.createServer((tcp_server) => {
  console.log('Client connected');

  tcp_server.on('data', (data) => {
    let dataString = data.toString();
    let data_ = dataString.split(" ");
    console.log(dataString);
    if (data_[0] == "BT:") {
      if(data_[1] != "NG")
      {
        const data = { mac: MAC, frame_id: data_[1] };
        socket.emit('assy-send-frame_id', data);
      }
     
    }
  });
  tcp_server.on('end', () => {
    console.log('Client disconnected');
  });
});

function listen_tcp() {
  server.listen(5000, () => {
    console.log('Server is listening on port 5000');
  });

}
module.exports = {
  server,
  listen_tcp,
};