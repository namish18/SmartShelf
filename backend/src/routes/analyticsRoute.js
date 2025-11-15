const express = require('express');
const router = express.Router();
const {
  getDemandForecastData,
  getFEFOOrdering,
  getTopSellingProducts,
  getNotificationAlerts
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication and Manager/Admin role
router.use(protect);
router.use(authorize('Manager', 'Admin'));

// Analytics routes
router.get('/demand-forecast', getDemandForecastData);
router.get('/fefo-ordering', getFEFOOrdering);
router.get('/top-selling', getTopSellingProducts);
router.get('/notification-alerts', getNotificationAlerts);

module.exports = router;
