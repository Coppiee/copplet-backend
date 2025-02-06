import { app } from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { listenToLocationChanges } from './utils/location.utils.js';
import Auth from './utils/auth.utils.js';
import { getUserAuth } from './db/db.js';
import { MESSAGE, ERROR_CODES } from './global/global.vars.js';

const PORT = app.get('PORT');
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const auth = new Auth(getUserAuth);

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error(`Status: ${400} ${MESSAGE[400]} (${ERROR_CODES.BAD_REQUEST})`));
  }
  try {
    const decodedToken = await auth.getUserByToken(token);
    socket.decoded_uid = decodedToken.uid;
    next();
  } catch (error) {
    next(new Error(`Status: ${401} ${MESSAGE[401]} (${ERROR_CODES.UNAUTHORIZED})`));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected', socket.decoded_uid);

  listenToLocationChanges(socket.decoded_uid, io);

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
