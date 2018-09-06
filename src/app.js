import express from 'express';
import signIn from './routes/signIn.js';


import errorHandler from './middleware/error.js';
import notFound from './middleware/404.js';
import noAuth from './middleware/401.js';
import noBody from './middleware/400.js';
import conflict from './middleware/409.js';

import morgan from 'morgan';

let app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(signIn);
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