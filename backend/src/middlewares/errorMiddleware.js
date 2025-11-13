const { sendErrorResponse } = require('../utils/responseHelper');

// Not Found middleware
exports.notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
exports.errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please login again.';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired. Please login again.';
    statusCode = 401;
  }

  return sendErrorResponse(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};
