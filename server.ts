import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import middlewareCors from './middleware/cors';
import apiRouter from './routes';

const app = express();
dotenv.config();
import connectDB from './config/db.config.js';

// Connect Database
connectDB();

// Aviod cors through middleware
app.use(middlewareCors.allowAll);

app.use(bodyParser.urlencoded({ extended: false }));
// Init Middleware
app.use(express.json());
app.use('/', apiRouter);

app.get('/', (request, response) => {
  response.json({ message: 'Hello from ChatGPT4 Server!' });
});

// set port, listen for requests
// const port = process.env.PORT || 8080;
const API_PORT = process.env.API_PORT
  ? Number.parseInt(process.env.API_PORT, 10)
  : 8080;

app.listen(API_PORT, (error) => {
  if (error) {
    return console.log('something bad happened', error);
  }
  console.log(`server is listening on ${API_PORT}`);
});
