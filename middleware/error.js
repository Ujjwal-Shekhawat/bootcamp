const { restart } = require('nodemon');
const errorres = require('../utils/errorres');

const errorHandler = (err, req, res, next) => {
  console.log(err);

  let error = { ...err };
  error.message = err.message;

  // Bad object id in mongodb
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new errorres(message, 404);
  }

  // If duplicate key
  if (err.name === 'MongoError' && err.code === 11000) {
    const message = `Duplicate key value found`;
    error = new errorres(message, 400);
  }

  // ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new errorres(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ message: error.message || `Server error` });
};

module.exports = errorHandler;
