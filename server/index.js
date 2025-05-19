import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import routes from './routes/index.js';
import scheduler from './services/scheduler.js';
import { initWebSocket } from './services/websocket.js';

dotenv.config();
const port = process.env.PORT

const app = express();
const httpServer = createServer(app);

initWebSocket(httpServer);

if (!port) {
  throw new Error("PORT is not defined in environment variables. Please set PORT in your .env file.");
}

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/api/', routes);

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  scheduler.start();
});