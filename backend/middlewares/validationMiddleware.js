const { validationResult } = require('express-validator');
const { sendErrorResponse } = require('../utils/responseHelper');

// Validation result checker
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }));
    
    return sendErrorResponse(
      res,
      'Validation failed',
      400,
      errorMessages
    );
  }
  
  next();
};
