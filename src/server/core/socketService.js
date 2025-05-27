/**
 * Socket Service
 * 
 * This service handles WebSocket connections for real-time messaging.
 */

const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config');

let io;

// Initialize Socket.IO server
function initialize(server) {
  io = socketIo(server, {
    cors: {
      origin: config.corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
    
    // Join user-specific room for targeted events
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
    }
  });
  
  console.log('Socket.IO server initialized');
  return io;
}

// Emit new message event
function emitNewMessage(message) {
  if (io) {
    io.emit('new_message', message);
  }
}

// Emit threads updated event
function emitThreadsUpdated() {
  if (io) {
    io.emit('threads_updated');
  }
}

// Emit event to specific user
function emitToUser(userId, event, data) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

module.exports = {
  initialize,
  emitNewMessage,
  emitThreadsUpdated,
  emitToUser
};