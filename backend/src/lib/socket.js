// import { Server } from 'socket.io';
// import http from 'http';
// import express from 'express';
// import { ENV } from './env.js';
// import { socketAuthMiddleware } from '../middleware/socket.auth.middleware.js';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ENV.CLIENT_URL,
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// //apply authentication middleware to all socket.io connections
// io.use(socketAuthMiddleware);

// //check user is online or offline
// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// //store online users
// const userSocketMap = {}; //{userId: socketId}

// io.on('connection', (socket) => {
//   console.log('A user connected', socket.user.fullName);

//   const userId = socket.userId;
//   userSocketMap[userId] = socket.id;
//   //socket.id generated from socket.io . Every time a client connects, Socket.IO assigns a unique string ID to that connection.

//   //io.emit() is used to sendFiles or messages to all connected clients
//   io.emit('getOnlineUsers', Object.keys(userSocketMap));

//   socket.on('disconnect', () => {
//     console.log('A user disconnected', socket.user.fullName);
//     delete userSocketMap[userId];
//     io.emit('getOnlineUsers', Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };

import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { ENV } from './env.js';
import { socketAuthMiddleware } from '../middleware/socket.auth.middleware.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const userSocketMap = {}; // { userId: socketId }

io.use(socketAuthMiddleware);

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on('connection', (socket) => {
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  console.log('User connected:', socket.user.fullName);

  // Broadcast online users
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // ------------------------------
  // Typing indicator
  // ------------------------------
  socket.on('typing', ({ receiverId, isTyping }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', {
        senderId: userId,
        isTyping,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.fullName);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };

/*
Concepts:

1. userSocketMap is your in-memory object that looks like:
   {
     "650abc123": "xYz123abc",   // userId → socket.id
     "650def456": "pQr456def"
   }

2. Object.keys(userSocketMap) takes all the keys (userIds) from that object.
   Example result:
   ["650abc123", "650def456"]

3. io.emit(...) sends an event to all connected sockets (broadcast).
   - First argument: event name ('getOnlineUsers')
   - Second argument: data to send (here, the array of userIds)

   So effectively, every connected client will receive an event called
   "getOnlineUsers" with data like:
   ["650abc123", "650def456"]

4. On the client side, you can catch it with:
   socket.on('getOnlineUsers', (onlineUsers) => {
     console.log('Currently online:', onlineUsers);
     // maybe show green dots next to those users in your UI
   });
*/
