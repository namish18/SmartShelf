const {
  DemandForecaster,
  ReorderPointCalculator,
  AnomalyDetector,
  ProductCategorizer
} = require('../utils/aiMLService');
const Inventory = require('../models/Inventory');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

// @desc    Get AI-powered demand forecast for products
// @route   GET /api/forecast/demand
// @access  Private (Manager/Admin)
exports.getDemandForecast = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const forecastDays = parseInt(req.query.days) || 7;

    // Get top products by recent activity
    const products = await Inventory.find({ quantity: { $gt: 0 } })
      .sort({ updatedAt: -1 })
      .limit(limit);

    const forecasts = [];

    for (const product of products) {
      // Simulate historical data (in production, this would come from actual transaction logs)
      const historicalQuantities = this.generateHistoricalData(product);
      const dates = this.generateHistoricalDates(historicalQuantities.length);

      // Use AI/ML forecasting
      const forecast = DemandForecaster.forecast({
        historicalQuantities,
        dates,
        forecastDays
      });

      forecasts.push({
        product: {
          id: product._id,
          name: product.productName,
          category: product.category,
          sku: product.sku,
          currentQuantity: product.quantity
        },
        ...forecast
      });
    }

    sendSuccessResponse(res, 'AI demand forecast generated successfully', {
      forecasts,
      generatedAt: new Date().toISOString(),
      algorithm: 'ML Ensemble (Linear Regression + Moving Average)'
    });

  } catch (error) {
    console.error('Demand Forecast Error:', error);
    sendErrorResponse(res, 'Error generating demand forecast', 500);
  }
};

// @desc    Get smart reorder recommendations
// @route   GET /api/forecast/reorder-points
// @access  Private (Manager/Admin)
exports.getReorderPoints = async (req, res) => {
  try {
    const products = await Inventory.find({ quantity: { $gt: 0 } });
    const recommendations = [];

    for (const product of products) {
      const historicalDemand = this.generateHistoricalData(product);

      const reorderAnalysis = ReorderPointCalculator.calculate({
        historicalDemand,
        leadTime: 7, // 7 days supplier lead time
        serviceLevel: 0.95 // 95% service level
      });

      const shouldReorder = product.quantity <= reorderAnalysis.reorderPoint;

      recommendations.push({
        product: {
          id: product._id,
          name: product.productName,
          category: product.category,
          currentQuantity: product.quantity
        },
        ...reorderAnalysis,
        shouldReorder,
        urgency: shouldReorder ? 
          (product.quantity <= reorderAnalysis.safetyStock ? 'critical' : 'high') : 
          'normal',
        recommendedOrderQuantity: shouldReorder ? 
          reorderAnalysis.maxStock - product.quantity : 0
      });
    }

    // Sort by urgency
    recommendations.sort((a, b) => {
      const urgencyOrder = { critical: 1, high: 2, normal: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

    sendSuccessResponse(res, 'Smart reorder points calculated', {
      recommendations,
      itemsNeedingReorder: recommendations.filter(r => r.shouldReorder).length,
      algorithm: 'Statistical Safety Stock Calculation'
    });

  } catch (error) {
    console.error('Reorder Points Error:', error);
    sendErrorResponse(res, 'Error calculating reorder points', 500);
  }
};

// @desc    Detect stock anomalies using AI
// @route   GET /api/forecast/anomalies
// @access  Private (Manager/Admin)
exports.detectAnomalies = async (req, res) => {
  try {
    const products = await Inventory.find();
    const anomalyReports = [];

    for (const product of products) {
      const historicalQuantities = this.generateHistoricalData(product);

      const anomalyReport = AnomalyDetector.detectStockAnomalies(historicalQuantities);

      if (anomalyReport.anomaliesCount > 0) {
        anomalyReports.push({
          product: {
            id: product._id,
            name: product.productName,
            category: product.category,
            currentQuantity: product.quantity
          },
          ...anomalyReport,
          recommendation: this.getAnomalyRecommendation(anomalyReport)
        });
      }
    }

    sendSuccessResponse(res, 'Anomaly detection completed', {
      totalProductsAnalyzed: products.length,
      productsWithAnomalies: anomalyReports.length,
      anomalyReports,
      algorithm: 'Z-Score Statistical Anomaly Detection'
    });

  } catch (error) {
    console.error('Anomaly Detection Error:', error);
    sendErrorResponse(res, 'Error detecting anomalies', 500);
  }
};

// @desc    Auto-categorize products using NLP
// @route   POST /api/forecast/categorize
// @access  Private (Manager/Admin)
exports.categorizeProduct = async (req, res) => {
  try {
    const { productName } = req.body;

    if (!productName) {
      return sendErrorResponse(res, 'Product name is required', 400);
    }

    const categorizer = new ProductCategorizer();
    const prediction = categorizer.predictCategory(productName);

    sendSuccessResponse(res, 'Product categorized using AI', {
      productName,
      ...prediction,
      algorithm: 'NLP Keyword-Based Classification'
    });

  } catch (error) {
    console.error('Categorization Error:', error);
    sendErrorResponse(res, 'Error categorizing product', 500);
  }
};

// @desc    Get stock trend analysis
// @route   GET /api/forecast/trends
// @access  Private (Manager/Admin)
exports.getStockTrends = async (req, res) => {
  try {
    const category = req.query.category;
    const query = category ? { category } : {};

    const products = await Inventory.find(query).limit(10);
    const trends = [];

    for (const product of products) {
      const historicalQuantities = this.generateHistoricalData(product);
      const dates = this.generateHistoricalDates(historicalQuantities.length);

      // Calculate trend using moving average
      const { MovingAverage } = require('../utils/aiMLService');
      const smoothed = MovingAverage.exponential(historicalQuantities, 0.3);

      const trend = smoothed[smoothed.length - 1] > smoothed[0] ? 'increasing' : 
                    smoothed[smoothed.length - 1] < smoothed[0] ? 'decreasing' : 'stable';

      const trendStrength = Math.abs(
        ((smoothed[smoothed.length - 1] - smoothed[0]) / smoothed[0]) * 100
      );

      trends.push({
        product: {
          id: product._id,
          name: product.productName,
          category: product.category,
          currentQuantity: product.quantity
        },
        trend,
        trendStrength: Math.round(trendStrength),
        smoothedData: smoothed.slice(-7), // Last 7 days
        recommendation: this.getTrendRecommendation(trend, trendStrength)
      });
    }

    sendSuccessResponse(res, 'Stock trends analyzed', {
      trends,
      algorithm: 'Exponential Moving Average Trend Analysis'
    });

  } catch (error) {
    console.error('Trend Analysis Error:', error);
    sendErrorResponse(res, 'Error analyzing trends', 500);
  }
};

// Helper function to generate historical data
// In production, this should fetch from transaction/stock movement logs
exports.generateHistoricalData = (product) => {
  const days = 30;
  const baseQuantity = product.quantity;
  const data = [];

  // Simulate gradual consumption with some randomness
  for (let i = days; i >= 0; i--) {
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    const quantity = Math.max(0, Math.round(baseQuantity * (1 + i * 0.05) * randomFactor));
    data.push(quantity);
  }

  return data.reverse();
};

// Helper function to generate historical dates
exports.generateHistoricalDates = (count) => {
  const dates = [];
  const today = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
};

// Helper function for anomaly recommendations
exports.getAnomalyRecommendation = (anomalyReport) => {
  if (anomalyReport.severity === 'high') {
    return 'Investigate immediately - unusual stock fluctuations detected';
  } else if (anomalyReport.severity === 'medium') {
    return 'Review stock movements - moderate anomalies detected';
  }
  return 'Monitor stock levels - minor anomalies detected';
};

// Helper function for trend recommendations
exports.getTrendRecommendation = (trend, strength) => {
  if (trend === 'decreasing' && strength > 20) {
    return 'Consider increasing orders - significant consumption trend';
  } else if (trend === 'increasing' && strength > 20) {
    return 'Review demand - stock accumulation detected';
  }
  return 'Continue normal operations - stable trend';
};
