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

// const userSocketMap = {}; // { userId: socketId }

// io.use(socketAuthMiddleware);

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// io.on('connection', (socket) => {
//   const userId = socket.userId;
//   userSocketMap[userId] = socket.id;

//   console.log('User connected:', socket.user.fullName);

//   // Broadcast online users
//   io.emit('getOnlineUsers', Object.keys(userSocketMap));

//   // ------------------------------
//   // Typing indicator
//   // ------------------------------
//   socket.on('typing', ({ receiverId, isTyping }) => {
//     const receiverSocketId = userSocketMap[receiverId];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('typing', {
//         senderId: userId,
//         isTyping,
//       });
//     }

//     // ------------------------------
//     // Handle message delete
//     // ------------------------------
//     socket.on('messageDeleted', ({ receiverId, messageId }) => {
//       const receiverSocketId = userSocketMap[receiverId];
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit('messageDeleted', { messageId });
//       }
//     });

//     // ------------------------------
//     // Handle message edit
//     // ------------------------------
//     socket.on('messageEdited', ({ receiverId, messageId, newText }) => {
//       const receiverSocketId = userSocketMap[receiverId];
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit('messageEdited', { messageId, newText });
//       }
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.user.fullName);
//     delete userSocketMap[userId];
//     io.emit('getOnlineUsers', Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };

// /*
// Concepts:

// 1. userSocketMap is your in-memory object that looks like:
//    {
//      "650abc123": "xYz123abc",   // userId → socket.id
//      "650def456": "pQr456def"
//    }

// 2. Object.keys(userSocketMap) takes all the keys (userIds) from that object.
//    Example result:
//    ["650abc123", "650def456"]

// 3. io.emit(...) sends an event to all connected sockets (broadcast).
//    - First argument: event name ('getOnlineUsers')
//    - Second argument: data to send (here, the array of userIds)

//    So effectively, every connected client will receive an event called
//    "getOnlineUsers" with data like:
//    ["650abc123", "650def456"]

// 4. On the client side, you can catch it with:
//    socket.on('getOnlineUsers', (onlineUsers) => {
//      console.log('Currently online:', onlineUsers);
//      // maybe show green dots next to those users in your UI
//    });
// */

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

// Map of connected users
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

  // ------------------------------
  // New message
  // ------------------------------
  socket.on('newMessage', ({ message }) => {
    const receiverSocketId = userSocketMap[message.receiverId];
    if (receiverSocketId) {
      // send message to receiver
      io.to(receiverSocketId).emit('newMessage', message);

      // send delivered receipt back to sender
      io.to(socket.id).emit('messageDelivered', {
        messageId: message._id,
        deliveredTo: message.receiverId,
      });
    }
  });

  // ------------------------------
  // Message edited
  // ------------------------------
  socket.on('messageEdited', ({ receiverId, messageId, newText }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageEdited', { messageId, newText });
    }
  });

  // ------------------------------
  // Message deleted
  // ------------------------------
  socket.on('messageDeleted', ({ receiverId, messageId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('messageDeleted', { messageId });
    }
  });

  // ------------------------------
  // Message seen
  // ------------------------------
  socket.on('messageSeen', ({ messageId, senderId }) => {
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit('messageSeen', {
        messageId,
        seenBy: userId,
      });
    }
  });

  // ------------------------------
  // Message delivered (optional manual trigger)
  // ------------------------------
  socket.on('messageDelivered', ({ messageId, receiverId }) => {
    const senderSocketId = socket.id; // current sender
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(senderSocketId).emit('messageDelivered', {
        messageId,
        deliveredTo: receiverId,
      });
    }
  });

  // ------------------------------
  // Disconnect
  // ------------------------------
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.fullName);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };
