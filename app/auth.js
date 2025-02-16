const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies['accessToken'];
  
    if (!token) {
        return res.status(401).redirect('/');
    }
  
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {  
      res.clearCookie('accessToken');
      res.status(401).redirect('/');
    }
  };

  function redirectIfLoggedIn(req, res, next) {
    const token = req.cookies['accessToken'];

    if (!token) {
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return next();
        }
        
        return res.redirect('/home');
    });
}

function authToken(req, res, next) {
    const token = req.cookies['accessToken'];
    if(!token) {
        res.redirect('/');
    }

    try{
        req.decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next();
    } catch {
        res.redirect('/');
    }
    
}

module.exports = { authenticate, authToken, redirectIfLoggedIn}