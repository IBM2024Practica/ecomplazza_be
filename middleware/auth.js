const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  console.log('Token:', token); // Log token

  if (!token) {
      console.log('No token provided');
      return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      console.log('Token valid, user:', req.user); // Log user info
      next();
  } catch (err) {
      console.log('Token is not valid');
      res.status(401).json({ msg: 'Token is not valid' });
  }
};