import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import middlewareCors from './middleware/cors';
import apiRouter from './routes';
import cors from 'cors';

const app = express();

// Initialization

dotenv.config();
import connectDB from './config/db.config.js';

// Connect Database
connectDB();
// connectRedis();
app.use(cors());

// Aviod cors through middleware
app.use(middlewareCors.allowAll);

// Init Middleware
app.use(express.json({ limit: '200mb' }));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '200mb',
    extended: true,
    parameterLimit: 1000000,
  })
);

app.use('/', apiRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Case Cruncher Server!' });
});

const API_PORT = process.env.API_PORT
  ? Number.parseInt(process.env.API_PORT, 10)
  : 8080;

app.listen(API_PORT, (error) => {
  if (error) {
    return console.log('something bad happened', error);
  }
  console.log(`server is listening on ${API_PORT}`);
});
