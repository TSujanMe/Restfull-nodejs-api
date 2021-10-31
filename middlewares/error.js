const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  // log to console for dev 
  // console.log(err)


  // mongose bad object id 
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // mongoose dublicate key 
  if (err.code === 11000) {
    const message = `same title is already exists `;
    error = new ErrorResponse(message, 400);
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
    console.log(typeof error)
   }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'server error '
  })
}

module.exports = errorHandler;