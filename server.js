import { app } from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { listenToLocationChanges } from './utils/location.utils.js';
import Auth from './utils/auth.utils.js'; // Import the Auth class
import { getUserAuth } from './db/db.js'; // Import the getUserAuth function

const PORT = app.get('PORT');
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const auth = new Auth(getUserAuth); // Create an instance of the Auth class

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    socket.emit('response', `Server received: ${message}`);
  });

  socket.on('token', async (token) => {
    try {
      const decodedToken = await auth.getUserByToken(token);
      const decoded_uid = decodedToken.uid;
      listenToLocationChanges(decoded_uid, io);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`⚡️Server is up and running on http://localhost:${PORT}`);
});
