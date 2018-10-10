import express from 'express';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import signUpRouter from './routes/signUpRouter.js';
import profileRouter from './routes/profileRouter.js';
import signInRouter from './routes/signInRouter.js';
import yelpRouter from './routes/yelpRouter.js';
import googleRouter from './routes/googleRouter.js';

import errorHandler from './middleware/error.js';
import notFound from './middleware/404.js';
import noAuth from './middleware/401.js';
import noBody from './middleware/400.js';
import conflict from './middleware/409.js';
import cors from 'cors';

let app = express();

//dev & parser middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors());
//routes middleware
app.use(signUpRouter);
app.use(signInRouter);
app.use(profileRouter);
app.use(yelpRouter);
app.use(googleRouter);

//error middleware
app.use(notFound);
app.use(noAuth);
app.use(conflict);
app.use(noBody);
app.use(errorHandler);

let server = false;

module.exports = {
  start: (port) => {
    if(!server) {
      server = app.listen(port, (err) => {
        if(err) { throw err; }
        console.log('Server running on ' + port);
      });
    } else {
      console.log('Server is already running');
    }
  },
  stop: () => {
    server.close(() => {
      console.log('Server has closed');
    });
  },
  server: app,
};