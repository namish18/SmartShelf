const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  updateQuantity,
  getInventoryByCategory,
  getInventoryBySupplier,
  getInventorySummary
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Analytics routes (accessible by all authenticated users)
router.get('/analytics/by-category', getInventoryByCategory);
router.get('/analytics/by-supplier', getInventoryBySupplier);
router.get('/analytics/summary', getInventorySummary);

// General routes
router.get('/', getAllInventory);
router.get('/:id', getInventoryById);

// Admin and Manager only routes
router.post('/', authorize('Admin', 'Manager'), createInventory);
router.put('/:id', authorize('Admin', 'Manager'), updateInventory);
router.patch('/:id/quantity', authorize('Admin', 'Manager'), updateQuantity);
router.delete('/:id', authorize('Admin', 'Manager'), deleteInventory);

module.exports = router;
