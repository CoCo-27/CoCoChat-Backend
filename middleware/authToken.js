const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

authToken = (req, res, next) => {
  let token = req.headers['x-auth-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    User.findOne({ _id: decoded.id })
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found' });
        req.user = user;
        return next();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
      });
  });
};
module.exports = authToken;
