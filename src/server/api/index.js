import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import threadRouter from '../routes/threadRouter';
import sendRouter from '../routes/sendRouter';
import messageBus from '../core/messageBus';

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Rutas REST
app.use('/threads', threadRouter);
app.use('/send', sendRouter);

// Configuración de Socket.IO
const io = new SocketIOServer(server, {
  cors: corsOptions,
  path: '/socket',
});

io.on('connection', (socket) => {
  console.log(`Socket.IO conectado: ${socket.id}`);
  socket.on('disconnect', (reason) => console.log(`Socket.IO desconectado: ${socket.id}, motivo: ${reason}`));
});

// Emitir evento al recibir un nuevo mensaje guardado
messageBus.on('message.saved', (msg) => {
  io.emit('new_message', msg);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;