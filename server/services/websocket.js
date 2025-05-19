  import { Server } from 'socket.io';

let ioInstance = null;

export const initWebSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const notifyClients = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};