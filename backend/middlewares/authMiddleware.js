const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendErrorResponse } = require('../utils/responseHelper');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    // Check for token in Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return sendErrorResponse(res, 'Not authorized to access this route. Please login.', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return sendErrorResponse(res, 'User not found', 401);
      }

      // Check if user is active
      if (!req.user.isActive) {
        return sendErrorResponse(res, 'Your account has been deactivated', 403);
      }

      next();
    } catch (error) {
      return sendErrorResponse(res, 'Not authorized. Invalid or expired token.', 401);
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return sendErrorResponse(res, 'Authentication failed', 500);
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 'Not authorized to access this route', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    next();
  };
};

// Optional auth - sets user if token exists but doesn't require it
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token invalid but continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    console.error('Optional Auth Middleware Error:', error);
    next();
  }
};
