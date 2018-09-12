import User from '../models/users.js';

export default (req, res, next) => {
  let authenticate = (userObj) => {
    User.authenticate(userObj)
      .then(user => {
        if (!user) {
          next(401);
        } else {
          req.token = user.generateToken();
          next();
        }
      });
  };

  let authorize = token => {
    User.authorize(token)
      .then(user => {
        if(!user) {
          next(401);
        } else {
          req.token = token;
          req.id = user._id;
          next();
        }
      });
  };

  try {

    if(req.cookies.token) {
      return authorize(req.cookies.token);
    }
    
    let userObj = {};
    let authHeader = req.headers.authorization;

    if(!authHeader) {
      return next(401);
    }

    if(authHeader.match(/basic/i)) {
      let base64Header = authHeader.replace(/Basic\s+/i, ''); 
      let base64Buffer = Buffer.from(base64Header,'base64');
      let bufferString = base64Buffer.toString();
      let [username,password] = bufferString.split(':');
      userObj = {username,password};
      
      authenticate(userObj);
    }

    if(authHeader.match(/bearer/i)) {
      let token = authHeader.replace(/bearer\s+/i, '');

      authorize(token);
    }
  } catch(error) {
    next(error);
  }
};