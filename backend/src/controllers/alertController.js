const Inventory = require('../models/Inventory');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

// @desc    Get low stock items
// @route   GET /api/alerts/low-stock
// @access  Private
exports.getLowStockAlerts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;

    const lowStockItems = await Inventory.find({
      quantity: { $gt: 0, $lt: threshold }
    })
      .populate('createdBy', 'name email')
      .sort({ quantity: 1 }); // Lowest quantity first

    const alerts = lowStockItems.map(item => ({
      ...item.toObject(),
      alertType: 'low_stock',
      severity: item.quantity <= threshold / 2 ? 'HIGH' : 'MEDIUM',
      message: `Only ${item.quantity} units left in stock`
    }));

    sendSuccessResponse(res, 'Low stock alerts fetched successfully', {
      alerts,
      count: alerts.length,
      threshold
    });

  } catch (error) {
    console.error('Get Low Stock Alerts Error:', error);
    sendErrorResponse(res, 'Error fetching low stock alerts', 500);
  }
};

// @desc    Get items expiring soon
// @route   GET /api/alerts/expiring-soon
// @access  Private
exports.getExpiringSoonAlerts = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || parseInt(process.env.EXPIRY_ALERT_DAYS) || 7;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    futureDate.setHours(23, 59, 59, 999);

    const expiringSoonItems = await Inventory.find({
      expiryDate: { $gte: today, $lte: futureDate },
      quantity: { $gt: 0 }
    })
      .populate('createdBy', 'name email')
      .sort({ expiryDate: 1 }); // Closest expiry first

    const alerts = expiringSoonItems.map(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
      
      let severity = 'LOW';
      if (daysUntilExpiry <= 1) severity = 'CRITICAL';
      else if (daysUntilExpiry <= 3) severity = 'HIGH';
      else if (daysUntilExpiry <= 5) severity = 'MEDIUM';

      return {
        ...item.toObject(),
        alertType: 'expiring_soon',
        severity,
        daysUntilExpiry,
        message: `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`
      };
    });

    sendSuccessResponse(res, 'Expiring soon alerts fetched successfully', {
      alerts,
      count: alerts.length,
      days
    });

  } catch (error) {
    console.error('Get Expiring Soon Alerts Error:', error);
    sendErrorResponse(res, 'Error fetching expiring soon alerts', 500);
  }
};

// @desc    Get expired items
// @route   GET /api/alerts/expired
// @access  Private
exports.getExpiredAlerts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredItems = await Inventory.find({
      expiryDate: { $lt: today }
    })
      .populate('createdBy', 'name email')
      .sort({ expiryDate: 1 }); // Oldest expiry first

    const alerts = expiredItems.map(item => {
      const daysExpired = Math.ceil((today - new Date(item.expiryDate)) / (1000 * 60 * 60 * 24));
      
      return {
        ...item.toObject(),
        alertType: 'expired',
        severity: 'CRITICAL',
        daysExpired,
        message: `Expired ${daysExpired} day${daysExpired !== 1 ? 's' : ''} ago`
      };
    });

    sendSuccessResponse(res, 'Expired items alerts fetched successfully', {
      alerts,
      count: alerts.length
    });

  } catch (error) {
    console.error('Get Expired Alerts Error:', error);
    sendErrorResponse(res, 'Error fetching expired alerts', 500);
  }
};

// @desc    Get out of stock items
// @route   GET /api/alerts/out-of-stock
// @access  Private
exports.getOutOfStockAlerts = async (req, res) => {
  try {
    const outOfStockItems = await Inventory.find({
      quantity: 0
    })
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 }); // Most recently updated first

    const alerts = outOfStockItems.map(item => ({
      ...item.toObject(),
      alertType: 'out_of_stock',
      severity: 'HIGH',
      message: 'Out of stock - Immediate restocking required'
    }));

    sendSuccessResponse(res, 'Out of stock alerts fetched successfully', {
      alerts,
      count: alerts.length
    });

  } catch (error) {
    console.error('Get Out Of Stock Alerts Error:', error);
    sendErrorResponse(res, 'Error fetching out of stock alerts', 500);
  }
};

// @desc    Get all critical alerts combined
// @route   GET /api/alerts/critical
// @access  Private
exports.getCriticalAlerts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    // Get expired items
    const expiredItems = await Inventory.find({
      expiryDate: { $lt: today }
    }).populate('createdBy', 'name email');

    // Get items expiring in next 3 days
    const criticalExpiryItems = await Inventory.find({
      expiryDate: { $gte: today, $lte: threeDaysLater },
      quantity: { $gt: 0 }
    }).populate('createdBy', 'name email');

    // Get out of stock items
    const outOfStockItems = await Inventory.find({
      quantity: 0
    }).populate('createdBy', 'name email');

    // Get critically low stock (less than 5 units)
    const criticalLowStock = await Inventory.find({
      quantity: { $gt: 0, $lt: 5 }
    }).populate('createdBy', 'name email');

    // Combine all alerts
    const alerts = [];

    // Add expired alerts
    expiredItems.forEach(item => {
      const daysExpired = Math.ceil((today - new Date(item.expiryDate)) / (1000 * 60 * 60 * 24));
      alerts.push({
        ...item.toObject(),
        alertType: 'expired',
        severity: 'CRITICAL',
        priority: 1,
        message: `Expired ${daysExpired} day${daysExpired !== 1 ? 's' : ''} ago`
      });
    });

    // Add critical expiry alerts
    criticalExpiryItems.forEach(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
      alerts.push({
        ...item.toObject(),
        alertType: 'expiring_critical',
        severity: 'CRITICAL',
        priority: 2,
        daysUntilExpiry,
        message: `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`
      });
    });

    // Add out of stock alerts
    outOfStockItems.forEach(item => {
      alerts.push({
        ...item.toObject(),
        alertType: 'out_of_stock',
        severity: 'HIGH',
        priority: 3,
        message: 'Out of stock - Immediate restocking required'
      });
    });

    // Add critical low stock alerts
    criticalLowStock.forEach(item => {
      alerts.push({
        ...item.toObject(),
        alertType: 'critical_low_stock',
        severity: 'HIGH',
        priority: 4,
        message: `Critical low stock - Only ${item.quantity} units remaining`
      });
    });

    // Sort by priority
    alerts.sort((a, b) => a.priority - b.priority);

    sendSuccessResponse(res, 'Critical alerts fetched successfully', {
      alerts,
      count: alerts.length,
      breakdown: {
        expired: expiredItems.length,
        expiringSoon: criticalExpiryItems.length,
        outOfStock: outOfStockItems.length,
        criticalLowStock: criticalLowStock.length
      }
    });

  } catch (error) {
    console.error('Get Critical Alerts Error:', error);
    sendErrorResponse(res, 'Error fetching critical alerts', 500);
  }
};

// @desc    Get category-specific alerts
// @route   GET /api/alerts/category/:category
// @access  Private
exports.getCategoryAlerts = async (req, res) => {
  try {
    const { category } = req.params;
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    // Get all alerts for this category
    const categoryItems = await Inventory.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') }
    }).populate('createdBy', 'name email');

    const alerts = [];

    categoryItems.forEach(item => {
      const itemAlerts = [];

      // Check if expired
      if (new Date(item.expiryDate) < today) {
        const daysExpired = Math.ceil((today - new Date(item.expiryDate)) / (1000 * 60 * 60 * 24));
        itemAlerts.push({
          type: 'expired',
          severity: 'CRITICAL',
          message: `Expired ${daysExpired} day${daysExpired !== 1 ? 's' : ''} ago`
        });
      }
      // Check if expiring soon
      else if (new Date(item.expiryDate) <= sevenDaysLater && item.quantity > 0) {
        const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
        itemAlerts.push({
          type: 'expiring_soon',
          severity: daysUntilExpiry <= 3 ? 'HIGH' : 'MEDIUM',
          message: `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`
        });
      }

      // Check stock level
      if (item.quantity === 0) {
        itemAlerts.push({
          type: 'out_of_stock',
          severity: 'HIGH',
          message: 'Out of stock'
        });
      } else if (item.quantity < 10) {
        itemAlerts.push({
          type: 'low_stock',
          severity: item.quantity < 5 ? 'HIGH' : 'MEDIUM',
          message: `Only ${item.quantity} units left`
        });
      }

      if (itemAlerts.length > 0) {
        alerts.push({
          ...item.toObject(),
          alerts: itemAlerts
        });
      }
    });

    sendSuccessResponse(res, `Alerts for ${category} category fetched successfully`, {
      category,
      alerts,
      count: alerts.length
    });

  } catch (error) {
    console.error('Get Category Alerts Error:', error);
    sendErrorResponse(res, 'Error fetching category alerts', 500);
  }
};

// @desc    Get alert summary/dashboard
// @route   GET /api/alerts/summary
// @access  Private
exports.getAlertSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const [
      expiredCount,
      expiringSoonCount,
      outOfStockCount,
      lowStockCount
    ] = await Promise.all([
      Inventory.countDocuments({ expiryDate: { $lt: today } }),
      Inventory.countDocuments({ 
        expiryDate: { $gte: today, $lte: sevenDaysLater },
        quantity: { $gt: 0 }
      }),
      Inventory.countDocuments({ quantity: 0 }),
      Inventory.countDocuments({ quantity: { $gt: 0, $lt: 10 } })
    ]);

    const totalAlerts = expiredCount + expiringSoonCount + outOfStockCount + lowStockCount;

    const summary = {
      totalAlerts,
      breakdown: {
        expired: expiredCount,
        expiringSoon: expiringSoonCount,
        outOfStock: outOfStockCount,
        lowStock: lowStockCount
      },
      criticalCount: expiredCount + outOfStockCount
    };

    sendSuccessResponse(res, 'Alert summary fetched successfully', { summary });

  } catch (error) {
    console.error('Get Alert Summary Error:', error);
    sendErrorResponse(res, 'Error fetching alert summary', 500);
  }
};
