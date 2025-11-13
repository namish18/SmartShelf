const { body, param } = require('express-validator');

exports.createTaskValidator = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Task description is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  
  body('assignedTo')
    .notEmpty()
    .withMessage('Assigned worker is required')
    .isMongoId()
    .withMessage('Invalid user ID')
];

exports.updateTaskValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed')
];

exports.updateTaskStatusValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed')
];
