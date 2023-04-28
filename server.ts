import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session, { SessionOptions } from 'express-session';
import dotenv from 'dotenv';
import middlewareCors from './middleware/cors';
import apiRouter from './routes';
import { View } from 'grandjs';
import cors from 'cors';
// import * as redis from 'redis';

// let redisClient;

// (async () => {
//   redisClient = redis.createClient();
//   redisClient.on('error', (error) => console.error(`Error : ${error}`));
//   await redisClient.connect();
//   console.log('Redis connected....');
// })();

View.settings.set('views', './views');

const app = express();

// Initialization

dotenv.config();
import connectDB from './config/db.config.js';
// import connectRedis from './config/redis.config';

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

// const expiresTime = 1000 * 60 * 60 * 1;
// const sessionConfig: SessionOptions = {
//   secret: process.env.TOKEN_KEY,
//   saveUninitialized: true,
//   resave: false,
// };

app.use('/', apiRouter);
// app.use(session(sessionConfig));

app.get('/', (req, res) => {
  console.log('Req session = ', req.session);
  if (req.session.view) {
    // The next time when user visits,
    // he is recognized by the cookie
    // and variable gets updated.
    req.session.view++;
    res.send('You visited this page for ' + req.session.view + ' times');
  } else {
    // If user visits the site for
    // first time
    req.session.view = 1;
    res.send('You have visited this page' + ' for first time ! Welcome....');
  }
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
