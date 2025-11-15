const Inventory = require('../models/Inventory');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

// @desc    Get demand forecasting data for products
// @route   GET /api/analytics/demand-forecast
// @access  Private (Manager/Admin)
exports.getDemandForecastData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Get top products by quantity (as a proxy for demand)
    const products = await Inventory.find()
      .sort({ quantity: -1, updatedAt: -1 })
      .limit(limit)
      .select('productName quantity category sku purchaseDate');

    // Generate forecast data for each product
    const forecastData = products.map(product => {
      const daysSincePurchase = Math.ceil(
        (new Date() - new Date(product.purchaseDate)) / (1000 * 60 * 60 * 24)
      );

      // Simple forecast: assume steady consumption
      const estimatedDailyConsumption = daysSincePurchase > 0 
        ? (product.quantity * 0.1) / daysSincePurchase 
        : product.quantity * 0.05;

      // Generate 7-day forecast
      const forecast = [];
      for (let i = 1; i <= 7; i++) {
        const projectedQty = Math.max(0, product.quantity - (estimatedDailyConsumption * i));
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        forecast.push({
          day: i,
          date: date.toISOString().split('T')[0],
          projectedQuantity: Math.round(projectedQty),
          trend: i <= 3 ? 'stable' : projectedQty < 10 ? 'critical' : 'normal'
        });
      }

      return {
        product: {
          id: product._id,
          name: product.productName,
          category: product.category,
          sku: product.sku,
          currentQuantity: product.quantity
        },
        forecast,
        estimatedDailyConsumption: Math.round(estimatedDailyConsumption * 10) / 10
      };
    });

    sendSuccessResponse(res, 'Demand forecast data fetched successfully', {
      forecasts: forecastData
    });

  } catch (error) {
    console.error('Get Demand Forecast Data Error:', error);
    sendErrorResponse(res, 'Error fetching demand forecast data', 500);
  }
};

// @desc    Get FEFO (First Expired, First Out) ordering
// @route   GET /api/analytics/fefo-ordering
// @access  Private (Manager/Admin)
exports.getFEFOOrdering = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const today = new Date();

    // Get products sorted by expiry date (nearest first)
    const products = await Inventory.find({
      expiryDate: { $gte: today }, // Only non-expired items
      quantity: { $gt: 0 } // Only items in stock
    })
      .sort({ expiryDate: 1 })
      .limit(limit)
      .select('productName category sku quantity expiryDate supplier');

    const fefoData = products.map(product => {
      const daysUntilExpiry = Math.ceil(
        (new Date(product.expiryDate) - today) / (1000 * 60 * 60 * 24)
      );

      let urgency = 'low';
      if (daysUntilExpiry <= 3) urgency = 'critical';
      else if (daysUntilExpiry <= 7) urgency = 'high';
      else if (daysUntilExpiry <= 14) urgency = 'medium';

      return {
        id: product._id,
        productName: product.productName,
        category: product.category,
        sku: product.sku,
        quantity: product.quantity,
        expiryDate: product.expiryDate,
        daysUntilExpiry,
        urgency,
        supplier: product.supplier
      };
    });

    sendSuccessResponse(res, 'FEFO ordering fetched successfully', {
      items: fefoData,
      count: fefoData.length
    });

  } catch (error) {
    console.error('Get FEFO Ordering Error:', error);
    sendErrorResponse(res, 'Error fetching FEFO ordering', 500);
  }
};

// @desc    Get most selling products (based on low stock + high initial quantity)
// @route   GET /api/analytics/top-selling
// @access  Private (Manager/Admin)
exports.getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Get products with quantity changes (proxy for sales)
    const products = await Inventory.find()
      .sort({ updatedAt: -1 })
      .limit(limit * 2) // Get more to filter
      .select('productName category sku quantity purchaseDate updatedAt');

    // Calculate "sales velocity" based on quantity and time
    const salesData = products
      .map(product => {
        const daysSincePurchase = Math.max(1, Math.ceil(
          (new Date() - new Date(product.purchaseDate)) / (1000 * 60 * 60 * 24)
        ));

        // Assume initial quantity was higher (simple estimation)
        const estimatedInitialQty = product.quantity * 1.5;
        const estimatedSold = Math.max(0, estimatedInitialQty - product.quantity);
        const salesVelocity = estimatedSold / daysSincePurchase;

        return {
          id: product._id,
          productName: product.productName,
          category: product.category,
          sku: product.sku,
          currentQuantity: product.quantity,
          estimatedSold: Math.round(estimatedSold),
          salesVelocity: Math.round(salesVelocity * 10) / 10,
          daysSincePurchase
        };
      })
      .filter(item => item.estimatedSold > 0)
      .sort((a, b) => b.salesVelocity - a.salesVelocity)
      .slice(0, limit);

    sendSuccessResponse(res, 'Top selling products fetched successfully', {
      products: salesData,
      count: salesData.length
    });

  } catch (error) {
    console.error('Get Top Selling Products Error:', error);
    sendErrorResponse(res, 'Error fetching top selling products', 500);
  }
};

// @desc    Get notification-style alerts
// @route   GET /api/analytics/notification-alerts
// @access  Private (Manager/Admin)
exports.getNotificationAlerts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const alerts = [];

    // Get expired items
    const expiredItems = await Inventory.find({
      expiryDate: { $lt: today }
    })
      .limit(5)
      .select('productName category expiryDate');

    expiredItems.forEach(item => {
      const daysExpired = Math.ceil((today - new Date(item.expiryDate)) / (1000 * 60 * 60 * 24));
      alerts.push({
        id: item._id,
        type: 'expired',
        severity: 'critical',
        productName: item.productName,
        category: item.category,
        message: `${item.productName} has expired ${daysExpired} day${daysExpired !== 1 ? 's' : ''} ago`,
        timestamp: new Date().toISOString()
      });
    });

    // Get items expiring soon
    const expiringSoon = await Inventory.find({
      expiryDate: { $gte: today, $lte: sevenDaysLater },
      quantity: { $gt: 0 }
    })
      .limit(5)
      .select('productName category expiryDate quantity');

    expiringSoon.forEach(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
      alerts.push({
        id: item._id,
        type: 'expiring_soon',
        severity: daysUntilExpiry <= 3 ? 'high' : 'medium',
        productName: item.productName,
        category: item.category,
        message: `${item.productName} is expiring in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
        timestamp: new Date().toISOString()
      });
    });

    // Get out of stock items
    const outOfStock = await Inventory.find({
      quantity: 0
    })
      .limit(5)
      .select('productName category');

    outOfStock.forEach(item => {
      alerts.push({
        id: item._id,
        type: 'out_of_stock',
        severity: 'high',
        productName: item.productName,
        category: item.category,
        message: `${item.productName} is out of stock`,
        timestamp: new Date().toISOString()
      });
    });

    // Get low stock items
    const lowStock = await Inventory.find({
      quantity: { $gt: 0, $lt: 10 }
    })
      .limit(5)
      .select('productName category quantity');

    lowStock.forEach(item => {
      alerts.push({
        id: item._id,
        type: 'low_stock',
        severity: item.quantity < 5 ? 'high' : 'medium',
        productName: item.productName,
        category: item.category,
        message: `${item.productName} is running low (${item.quantity} units remaining)`,
        timestamp: new Date().toISOString()
      });
    });

    // Sort by severity and limit
    const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    sendSuccessResponse(res, 'Notification alerts fetched successfully', {
      alerts: alerts.slice(0, limit),
      count: alerts.length
    });

  } catch (error) {
    console.error('Get Notification Alerts Error:', error);
    sendErrorResponse(res, 'Error fetching notification alerts', 500);
  }
};
