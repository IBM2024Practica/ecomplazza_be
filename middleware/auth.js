const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // Get token from Authorization header
  const token = req.header('Authorization');

  console.log('Token:', token); // Log token

  // Check if no token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Remove "Bearer " from token string if present
    const tokenWithoutBearer = token.startsWith('Bearer ')
      ? token.slice(7, token.length).trimLeft()
      : token;

    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log('Token valid, user:', req.user); // Log user info
    next();
  } catch (err) {
    console.log('Token is not valid');
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
