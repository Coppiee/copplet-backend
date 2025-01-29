import { app } from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = app.get('PORT');
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    socket.emit('response', `Server received: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`⚡️Server is up and running on http://localhost:${PORT}`);
});
