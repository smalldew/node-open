
const http = require('http');
const server = http.createServer()
const io = require('socket.io').listen(server);

const port = 9002

io.sockets.on('connection', (socket) => {
    // 用户进入聊天室
    let user = '游客' + socket.id.substring(0, 6)
    io.sockets.emit('userConnect', user);

    // 用户发送信息
    socket.on('send', function (data) {
      io.sockets.emit('server', data)
    });

    // 用户离开聊天室
    socket.on('disconnect', () => {
      io.sockets.emit('userDisconnect', user + '离开聊天室');
  });
});

server.listen(port, () => {
  console.log('服务器运行在 ' + port + ' 端口')
})
