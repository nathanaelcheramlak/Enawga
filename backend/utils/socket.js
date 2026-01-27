import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const usersSocketId = new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) usersSocketId.set(userId, socket.id);

  socket.on('sendMessage', (data) => {
    socket.broadcast.emit('recieveMessage', data);
  });

  socket.on('disconnect', () => {
    usersSocketId.delete(userId);
  });
});

const getSocketIdFromUserId = (userId) => {
  return usersSocketId.get(userId);
};

export { app, server, io, getSocketIdFromUserId };
