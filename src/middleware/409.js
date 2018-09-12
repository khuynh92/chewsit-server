'use strict';

export default (err, req, res, next) => {
  if(err && err.code && err.code === 11000) {
    console.log(err);
    res.statusCode = 409;
    res.statusMessage = 'conflict';
    res.write('ERROR: Username/E-mail Already exists');
    res.end();
  } else {
    next(err);
  }
};