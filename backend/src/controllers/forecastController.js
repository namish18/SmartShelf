const Inventory = require('../models/Inventory');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');
const { 
  calculateMovingAverage, 
  calculateConsumptionRate, 
  calculateReorderPoint,
  predictDemandTrend 
} = require('../utils/forecastingHelper');

// @desc    Get demand forecast for specific product
// @route   GET /api/forecast/demand
// @access  Private
exports.getDemandForecast = async (req, res) => {
  try {
    const { productId } = req.query;
    const months = parseInt(req.query.months) || 3;

    if (!productId) {
      return sendErrorResponse(res, 'Product ID is required', 400);
    }

    const product = await Inventory.findById(productId);

    if (!product) {
      return sendErrorResponse(res, 'Product not found', 404);
    }

    // Calculate days since purchase
    const daysSincePurchase = Math.ceil(
      (new Date() - new Date(product.purchaseDate)) / (1000 * 60 * 60 * 24)
    );

    if (daysSincePurchase < 7) {
      return sendSuccessResponse(res, 'Insufficient historical data for forecasting', {
        product: {
          id: product._id,
          productName: product.productName,
          currentQuantity: product.quantity
        },
        forecast: null,
        message: 'Product needs at least 7 days of historical data for accurate forecasting'
      });
    }

    // Simple consumption rate calculation
    // Assuming initial quantity was higher (could be tracked in a separate history table)
    const estimatedInitialQty = product.quantity * 2; // Rough estimate
    const consumptionRate = calculateConsumptionRate(
      product.quantity,
      daysSincePurchase,
      estimatedInitialQty
    );

    // Generate forecast for next N months
    const forecast = [];
    const daysInMonth = 30;

    for (let i = 1; i <= months; i++) {
      const projectedDemand = Math.round(consumptionRate * daysInMonth * i);
      const projectedStock = Math.max(0, product.quantity - projectedDemand);
      
      forecast.push({
        month: `Month ${i}`,
        projectedDemand,
        projectedStock,
        needsReorder: projectedStock < 10
      });
    }

    sendSuccessResponse(res, 'Demand forecast generated successfully', {
      product: {
        id: product._id,
        productName: product.productName,
        category: product.category,
        currentQuantity: product.quantity,
        sku: product.sku
      },
      consumptionRate: parseFloat(consumptionRate.toFixed(2)),
      forecast,
      period: `${months} months`
    });

  } catch (error) {
    console.error('Get Demand Forecast Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid product ID', 400);
    }
    
    sendErrorResponse(res, 'Error generating demand forecast', 500);
  }
};

// @desc    Get category-level demand forecast
// @route   GET /api/forecast/demand/category/:category
// @access  Private
exports.getCategoryDemandForecast = async (req, res) => {
  try {
    const { category } = req.params;
    const months = parseInt(req.query.months) || 3;

    const categoryItems = await Inventory.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') }
    });

    if (categoryItems.length === 0) {
      return sendErrorResponse(res, 'No items found in this category', 404);
    }

    const totalCurrentQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate average consumption rate for category
    let totalConsumptionRate = 0;
    let validItems = 0;

    categoryItems.forEach(item => {
      const daysSincePurchase = Math.ceil(
        (new Date() - new Date(item.purchaseDate)) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSincePurchase >= 7) {
        const estimatedInitialQty = item.quantity * 2;
        const rate = calculateConsumptionRate(item.quantity, daysSincePurchase, estimatedInitialQty);
        totalConsumptionRate += rate;
        validItems++;
      }
    });

    const avgConsumptionRate = validItems > 0 ? totalConsumptionRate / validItems : 0;

    // Generate forecast
    const forecast = [];
    const daysInMonth = 30;

    for (let i = 1; i <= months; i++) {
      const projectedDemand = Math.round(avgConsumptionRate * daysInMonth * i * categoryItems.length);
      const projectedStock = Math.max(0, totalCurrentQuantity - projectedDemand);
      
      forecast.push({
        month: `Month ${i}`,
        projectedDemand,
        projectedStock
      });
    }

    sendSuccessResponse(res, 'Category demand forecast generated successfully', {
      category,
      itemCount: categoryItems.length,
      currentTotalQuantity: totalCurrentQuantity,
      avgConsumptionRate: parseFloat(avgConsumptionRate.toFixed(2)),
      forecast,
      period: `${months} months`
    });

  } catch (error) {
    console.error('Get Category Demand Forecast Error:', error);
    sendErrorResponse(res, 'Error generating category demand forecast', 500);
  }
};

// @desc    Get reorder suggestions
// @route   GET /api/forecast/reorder-suggestions
// @access  Private
exports.getReorderSuggestions = async (req, res) => {
  try {
    const leadTimeDays = parseInt(req.query.leadTime) || 7; // Default 7 days lead time
    const safetyStockMultiplier = parseFloat(req.query.safetyStock) || 1.5;

    const allItems = await Inventory.find({
      quantity: { $gte: 0 }
    }).sort({ quantity: 1 });

    const suggestions = [];

    for (const item of allItems) {
      const daysSincePurchase = Math.ceil(
        (new Date() - new Date(item.purchaseDate)) / (1000 * 60 * 60 * 24)
      );

      if (daysSincePurchase < 7) continue;

      const estimatedInitialQty = item.quantity * 2;
      const consumptionRate = calculateConsumptionRate(
        item.quantity,
        daysSincePurchase,
        estimatedInitialQty
      );

      const reorderPoint = calculateReorderPoint(
        consumptionRate,
        leadTimeDays,
        Math.ceil(consumptionRate * leadTimeDays * (safetyStockMultiplier - 1))
      );

      if (item.quantity <= reorderPoint) {
        const suggestedOrderQty = Math.ceil(consumptionRate * 30); // 30 days worth of stock
        
        suggestions.push({
          product: {
            id: item._id,
            productName: item.productName,
            category: item.category,
            sku: item.sku,
            supplier: item.supplier
          },
          currentQuantity: item.quantity,
          reorderPoint: Math.round(reorderPoint),
          suggestedOrderQuantity: suggestedOrderQty,
          urgency: item.quantity === 0 ? 'CRITICAL' : item.quantity < reorderPoint / 2 ? 'HIGH' : 'MEDIUM',
          consumptionRate: parseFloat(consumptionRate.toFixed(2)),
          estimatedStockoutDays: item.quantity > 0 ? Math.ceil(item.quantity / consumptionRate) : 0
        });
      }
    }

    // Sort by urgency
    const urgencyOrder = { CRITICAL: 1, HIGH: 2, MEDIUM: 3 };
    suggestions.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

    sendSuccessResponse(res, 'Reorder suggestions generated successfully', {
      suggestions,
      count: suggestions.length,
      parameters: {
        leadTimeDays,
        safetyStockMultiplier
      }
    });

  } catch (error) {
    console.error('Get Reorder Suggestions Error:', error);
    sendErrorResponse(res, 'Error generating reorder suggestions', 500);
  }
};

// @desc    Get stock trends for a product
// @route   GET /api/forecast/stock-trends
// @access  Private
exports.getStockTrends = async (req, res) => {
  try {
    const { productId } = req.query;
    const period = req.query.period || '30days';

    if (!productId) {
      return sendErrorResponse(res, 'Product ID is required', 400);
    }

    const product = await Inventory.findById(productId);

    if (!product) {
      return sendErrorResponse(res, 'Product not found', 404);
    }

    const daysSincePurchase = Math.ceil(
      (new Date() - new Date(product.purchaseDate)) / (1000 * 60 * 60 * 24)
    );

    const estimatedInitialQty = product.quantity * 2;
    const consumptionRate = calculateConsumptionRate(
      product.quantity,
      daysSincePurchase,
      estimatedInitialQty
    );

    // Generate historical trend (estimated)
    const trends = [];
    const intervalDays = period === '7days' ? 1 : period === '30days' ? 5 : 10;
    const totalDays = period === '7days' ? 7 : period === '30days' ? 30 : 90;

    for (let day = totalDays; day >= 0; day -= intervalDays) {
      const estimatedQty = Math.max(0, Math.round(product.quantity + (consumptionRate * day)));
      const date = new Date();
      date.setDate(date.getDate() - day);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        estimatedQuantity: estimatedQty
      });
    }

    // Add current quantity
    trends.push({
      date: new Date().toISOString().split('T')[0],
      estimatedQuantity: product.quantity,
      isCurrent: true
    });

    const velocityPerDay = parseFloat(consumptionRate.toFixed(2));
    const trend = velocityPerDay > 0 ? 'decreasing' : velocityPerDay < 0 ? 'increasing' : 'stable';

    sendSuccessResponse(res, 'Stock trends fetched successfully', {
      product: {
        id: product._id,
        productName: product.productName,
        category: product.category,
        currentQuantity: product.quantity
      },
      trends,
      analysis: {
        velocityPerDay,
        trend,
        period
      }
    });

  } catch (error) {
    console.error('Get Stock Trends Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid product ID', 400);
    }
    
    sendErrorResponse(res, 'Error fetching stock trends', 500);
  }
};

// @desc    Predict items likely to expire unsold
// @route   GET /api/forecast/expiry-forecast
// @access  Private
exports.getExpiryForecast = async (req, res) => {
  try {
    const today = new Date();
    
    // Get items that haven't expired yet
    const activeItems = await Inventory.find({
      expiryDate: { $gte: today },
      quantity: { $gt: 0 }
    }).sort({ expiryDate: 1 });

    const forecasts = [];

    for (const item of activeItems) {
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24)
      );

      const daysSincePurchase = Math.ceil(
        (today - new Date(item.purchaseDate)) / (1000 * 60 * 60 * 24)
      );

      if (daysSincePurchase < 3) continue; // Need some history

      const estimatedInitialQty = item.quantity * 2;
      const consumptionRate = calculateConsumptionRate(
        item.quantity,
        daysSincePurchase,
        estimatedInitialQty
      );

      const projectedQtyAtExpiry = Math.max(0, item.quantity - (consumptionRate * daysUntilExpiry));
      const wastagePercentage = item.quantity > 0 
        ? ((projectedQtyAtExpiry / item.quantity) * 100).toFixed(1)
        : 0;

      if (projectedQtyAtExpiry > 0) {
        let riskLevel = 'LOW';
        if (wastagePercentage > 50) riskLevel = 'HIGH';
        else if (wastagePercentage > 25) riskLevel = 'MEDIUM';

        forecasts.push({
          product: {
            id: item._id,
            productName: item.productName,
            category: item.category,
            sku: item.sku
          },
          currentQuantity: item.quantity,
          expiryDate: item.expiryDate,
          daysUntilExpiry,
          consumptionRate: parseFloat(consumptionRate.toFixed(2)),
          projectedQuantityAtExpiry: Math.round(projectedQtyAtExpiry),
          wastagePercentage: parseFloat(wastagePercentage),
          riskLevel,
          recommendation: riskLevel === 'HIGH' 
            ? 'Consider promotional pricing or immediate sale'
            : riskLevel === 'MEDIUM'
            ? 'Monitor closely and consider discounts'
            : 'Current consumption rate is acceptable'
        });
      }
    }

    // Sort by risk level
    const riskOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    forecasts.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);

    sendSuccessResponse(res, 'Expiry forecast generated successfully', {
      forecasts,
      count: forecasts.length,
      highRiskCount: forecasts.filter(f => f.riskLevel === 'HIGH').length
    });

  } catch (error) {
    console.error('Get Expiry Forecast Error:', error);
    sendErrorResponse(res, 'Error generating expiry forecast', 500);
  }
};
