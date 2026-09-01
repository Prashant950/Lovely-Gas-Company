// middleware/errorHandler.js

// Handles unmatched routes -> 404
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Centralized error handler. All thrown/next(err) errors land here.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // Mongoose duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Email already exists';
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
