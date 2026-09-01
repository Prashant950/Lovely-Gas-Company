// utils/generateToken.js
const jwt = require('jsonwebtoken');

// Sign a JWT containing the user id.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;
