const express = require('express');
const router = express.Router();
const {
  getDemandForecast,
  getCategoryDemandForecast,
  getReorderSuggestions,
  getStockTrends,
  getExpiryForecast
} = require('../controllers/forecastController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication and Manager/Admin role
router.use(protect);
router.use(authorize('Manager', 'Admin'));

// Forecast routes
router.get('/demand', getDemandForecast);
router.get('/demand/category/:category', getCategoryDemandForecast);
router.get('/reorder-suggestions', getReorderSuggestions);
router.get('/stock-trends', getStockTrends);
router.get('/expiry-forecast', getExpiryForecast);

module.exports = router;
