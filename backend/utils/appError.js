// utils/appError.js
// Small helper to create an Error carrying an HTTP status code,
// which the centralized errorHandler reads via err.statusCode.
const appError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = appError;
