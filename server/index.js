import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();

const port = process.env.PORT

if (!port) {
  throw new Error("PORT is not defined in environment variables. Please set PORT in your .env file.");
}

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
