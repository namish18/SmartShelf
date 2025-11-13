const express = require('express');
const router = express.Router();
const {
  getLowStockAlerts,
  getExpiringSoonAlerts,
  getExpiredAlerts,
  getOutOfStockAlerts,
  getCriticalAlerts,
  getCategoryAlerts,
  getAlertSummary
} = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Alert routes
router.get('/low-stock', getLowStockAlerts);
router.get('/expiring-soon', getExpiringSoonAlerts);
router.get('/expired', getExpiredAlerts);
router.get('/out-of-stock', getOutOfStockAlerts);
router.get('/critical', getCriticalAlerts);
router.get('/summary', getAlertSummary);
router.get('/category/:category', getCategoryAlerts);

module.exports = router;
