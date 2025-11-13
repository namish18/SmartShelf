const { sendErrorResponse } = require('../utils/responseHelper');

// Check if user has required role
exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
        403
      );
    }

    next();
  };
};

// Check if user is Admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return sendErrorResponse(res, 'Authentication required', 401);
  }

  if (req.user.role !== 'Admin') {
    return sendErrorResponse(res, 'Access denied. Admin privileges required.', 403);
  }

  next();
};

// Check if user is Manager
exports.isManager = (req, res, next) => {
  if (!req.user) {
    return sendErrorResponse(res, 'Authentication required', 401);
  }

  if (req.user.role !== 'Manager' && req.user.role !== 'Admin') {
    return sendErrorResponse(res, 'Access denied. Manager or Admin privileges required.', 403);
  }

  next();
};

// Check if user is Worker
exports.isWorker = (req, res, next) => {
  if (!req.user) {
    return sendErrorResponse(res, 'Authentication required', 401);
  }

  if (req.user.role !== 'Worker') {
    return sendErrorResponse(res, 'Access denied. Worker privileges required.', 403);
  }

  next();
};

// Check if user is Manager or Admin (for inventory and task management)
exports.isManagerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return sendErrorResponse(res, 'Authentication required', 401);
  }

  if (req.user.role !== 'Manager' && req.user.role !== 'Admin') {
    return sendErrorResponse(
      res,
      'Access denied. Manager or Admin privileges required.',
      403
    );
  }

  next();
};

// Check if user owns the resource or is Admin
exports.isOwnerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }

    const isOwner = req.user._id.toString() === resourceUserId.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isAdmin) {
      return sendErrorResponse(
        res,
        'Access denied. You can only access your own resources.',
        403
      );
    }

    next();
  };
};
