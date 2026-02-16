const express = require('express');
const router = express.Router();
const {
  getDemandForecast,
  getReorderPoints,
  detectAnomalies,
  categorizeProduct,
  getStockTrends
} = require('../controllers/forecastController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication and Manager/Admin role
router.use(protect);
router.use(authorize('Manager', 'Admin'));

// AI/ML Forecast Routes
router.get('/demand', getDemandForecast);
router.get('/reorder-points', getReorderPoints);
router.get('/anomalies', detectAnomalies);
router.post('/categorize', categorizeProduct);
router.get('/trends', getStockTrends);

module.exports = router;
