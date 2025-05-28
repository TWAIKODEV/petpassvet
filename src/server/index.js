/**
 * Main Server Entry Point
 * 
 * This file initializes the Express server, connects to the database,
 * and sets up the API routes and webhooks.
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const { syncDatabase } = require('./models');
const config = require('./config');
const socketService = require('./core/socketService');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with proper CORS and path
const io = require('socket.io')(server, {
  path: '/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize Socket.IO service
socketService.initialize(server);

// Middleware
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/threads', require('./api/routes/threads'));
app.use('/send', require('./api/routes/messages'));

// Webhook routes
app.use('/webhook/whatsapp', require('./adapters/whatsapp'));
app.use('/webhook/facebook', require('./adapters/facebook'));
app.use('/webhook/instagram', require('./adapters/instagram'));
app.use('/webhook/outlook', require('./adapters/outlook'));
app.use('/webhook/sms', require('./adapters/sms'));
app.use('/webhook/typebot', require('./adapters/typebot'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  try {
    // Sync database models
    await syncDatabase();
    
    // Start server
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();