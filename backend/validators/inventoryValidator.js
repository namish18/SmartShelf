const { body, param } = require('express-validator');

exports.createInventoryValidator = [
  body('productName')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .matches(/^[A-Z]{2}-\d{3,}$/)
    .withMessage('SKU must follow format: XX-000 (e.g., DA-001)'),
  
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('purchaseDate')
    .notEmpty()
    .withMessage('Purchase date is required')
    .isISO8601()
    .withMessage('Invalid purchase date format'),
  
  body('expiryDate')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isISO8601()
    .withMessage('Invalid expiry date format'),
  
  body('supplier')
    .trim()
    .notEmpty()
    .withMessage('Supplier is required')
];

exports.updateInventoryValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid inventory item ID'),
  
  body('productName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('purchaseDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid purchase date format'),
  
  body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid expiry date format')
];
