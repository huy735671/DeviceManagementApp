// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendNotification', (message) => {
    // Gửi thông báo đến tất cả các client
    io.emit('receiveNotification', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
