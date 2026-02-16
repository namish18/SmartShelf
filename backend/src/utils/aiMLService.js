/**
 * AI/ML Service Module for SmartShelf
 * Implements various machine learning algorithms for intelligent inventory management
 */

// Simple Linear Regression for demand forecasting
class LinearRegression {
  constructor() {
    this.slope = 0;
    this.intercept = 0;
  }

  /**
   * Train the linear regression model
   * @param {Array<number>} X - Time periods (days)
   * @param {Array<number>} Y - Quantities consumed
   */
  fit(X, Y) {
    const n = X.length;
    if (n === 0 || n !== Y.length) return;

    const sumX = X.reduce((a, b) => a + b, 0);
    const sumY = Y.reduce((a, b) => a + b, 0);
    const sumXY = X.reduce((acc, x, i) => acc + x * Y[i], 0);
    const sumXX = X.reduce((acc, x) => acc + x * x, 0);

    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
  }

  /**
   * Predict quantity for given time period
   * @param {number} x - Time period
   * @returns {number} Predicted quantity
   */
  predict(x) {
    return this.slope * x + this.intercept;
  }

  /**
   * Calculate R-squared score (model accuracy)
   * @param {Array<number>} X - Input values
   * @param {Array<number>} Y - Actual values
   * @returns {number} R-squared score (0-1)
   */
  score(X, Y) {
    const predictions = X.map(x => this.predict(x));
    const meanY = Y.reduce((a, b) => a + b, 0) / Y.length;

    const ssRes = Y.reduce((acc, y, i) => acc + Math.pow(y - predictions[i], 2), 0);
    const ssTot = Y.reduce((acc, y) => acc + Math.pow(y - meanY, 2), 0);

    return 1 - (ssRes / ssTot);
  }
}

// Moving Average for trend smoothing
class MovingAverage {
  /**
   * Calculate Simple Moving Average
   * @param {Array<number>} data - Time series data
   * @param {number} window - Window size
   * @returns {Array<number>} Smoothed data
   */
  static simple(data, window = 3) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < window - 1) {
        result.push(data[i]);
      } else {
        const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / window);
      }
    }
    return result;
  }

  /**
   * Calculate Exponential Moving Average
   * @param {Array<number>} data - Time series data
   * @param {number} alpha - Smoothing factor (0-1)
   * @returns {Array<number>} Smoothed data
   */
  static exponential(data, alpha = 0.3) {
    const result = [data[0]];
    for (let i = 1; i < data.length; i++) {
      result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
  }
}

// Anomaly Detection using Z-Score
class AnomalyDetector {
  /**
   * Detect anomalies using statistical Z-score method
   * @param {Array<number>} data - Data points
   * @param {number} threshold - Z-score threshold (default: 2)
   * @returns {Array<{index: number, value: number, zscore: number, isAnomaly: boolean}>}
   */
  static detectZScore(data, threshold = 2) {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    return data.map((value, index) => {
      const zscore = (value - mean) / stdDev;
      return {
        index,
        value,
        zscore: Math.abs(zscore),
        isAnomaly: Math.abs(zscore) > threshold
      };
    });
  }

  /**
   * Detect sudden stock changes
   * @param {Array<number>} quantities - Historical quantities
   * @returns {Object} Anomaly report
   */
  static detectStockAnomalies(quantities) {
    const anomalies = this.detectZScore(quantities);
    const detected = anomalies.filter(a => a.isAnomaly);

    return {
      totalPoints: quantities.length,
      anomaliesCount: detected.length,
      anomalies: detected,
      severity: detected.length > quantities.length * 0.2 ? 'high' : 
                detected.length > quantities.length * 0.1 ? 'medium' : 'low'
    };
  }
}

// Smart Reorder Point Calculator using ML
class ReorderPointCalculator {
  /**
   * Calculate intelligent reorder point
   * @param {Object} params
   * @param {Array<number>} params.historicalDemand - Past demand data
   * @param {number} params.leadTime - Supplier lead time in days
   * @param {number} params.serviceLevel - Desired service level (0.95 = 95%)
   * @returns {Object} Reorder point and safety stock
   */
  static calculate({ historicalDemand, leadTime = 7, serviceLevel = 0.95 }) {
    // Calculate average daily demand
    const avgDemand = historicalDemand.reduce((a, b) => a + b, 0) / historicalDemand.length;

    // Calculate demand standard deviation
    const variance = historicalDemand.reduce((acc, d) => 
      acc + Math.pow(d - avgDemand, 2), 0) / historicalDemand.length;
    const stdDev = Math.sqrt(variance);

    // Z-score for service level (95% = 1.65, 99% = 2.33)
    const zScore = serviceLevel >= 0.99 ? 2.33 : 
                   serviceLevel >= 0.95 ? 1.65 : 1.28;

    // Safety stock = Z-score * std dev * sqrt(lead time)
    const safetyStock = Math.ceil(zScore * stdDev * Math.sqrt(leadTime));

    // Reorder point = (avg demand * lead time) + safety stock
    const reorderPoint = Math.ceil(avgDemand * leadTime + safetyStock);

    return {
      avgDailyDemand: Math.round(avgDemand * 10) / 10,
      stdDeviation: Math.round(stdDev * 10) / 10,
      safetyStock,
      reorderPoint,
      maxStock: reorderPoint + safetyStock * 2,
      confidence: `${(serviceLevel * 100).toFixed(0)}%`
    };
  }
}

// Demand Forecasting with Multiple Methods
class DemandForecaster {
  /**
   * Generate comprehensive demand forecast
   * @param {Object} params
   * @param {Array<number>} params.historicalQuantities - Past quantities
   * @param {Array<Date>} params.dates - Corresponding dates
   * @param {number} params.forecastDays - Days to forecast
   * @returns {Object} Forecast with multiple methods
   */
  static forecast({ historicalQuantities, dates, forecastDays = 7 }) {
    const n = historicalQuantities.length;
    if (n < 3) {
      return this.simpleForecast(historicalQuantities, forecastDays);
    }

    // Prepare data (days since first date)
    const X = dates.map((date, i) => i + 1);
    const Y = historicalQuantities;

    // Linear Regression Forecast
    const lr = new LinearRegression();
    lr.fit(X, Y);
    const lrAccuracy = lr.score(X, Y);

    // Moving Average Forecast
    const ma = MovingAverage.simple(Y, Math.min(3, n));
    const ema = MovingAverage.exponential(Y, 0.3);

    // Generate predictions
    const forecasts = [];
    for (let i = 1; i <= forecastDays; i++) {
      const futureDay = n + i;
      const lrPrediction = Math.max(0, lr.predict(futureDay));
      const maPrediction = ma[ma.length - 1];
      const emaPrediction = ema[ema.length - 1];

      // Ensemble: weighted average of methods
      const ensemblePrediction = (
        lrPrediction * 0.5 + 
        maPrediction * 0.25 + 
        emaPrediction * 0.25
      );

      forecasts.push({
        day: i,
        date: new Date(dates[dates.length - 1].getTime() + i * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
        linearRegression: Math.round(lrPrediction),
        movingAverage: Math.round(maPrediction),
        exponentialMA: Math.round(emaPrediction),
        ensemble: Math.round(ensemblePrediction),
        trend: this.determineTrend(ensemblePrediction, Y[Y.length - 1])
      });
    }

    return {
      method: 'ML Ensemble',
      accuracy: Math.round(lrAccuracy * 100),
      forecasts,
      metadata: {
        historicalDataPoints: n,
        forecastHorizon: forecastDays,
        models: ['Linear Regression', 'Moving Average', 'Exponential MA'],
        avgHistoricalQuantity: Math.round(Y.reduce((a, b) => a + b, 0) / n)
      }
    };
  }

  static simpleForecast(quantities, days) {
    const avg = quantities.reduce((a, b) => a + b, 0) / quantities.length;
    const forecasts = Array(days).fill(null).map((_, i) => ({
      day: i + 1,
      ensemble: Math.round(avg),
      trend: 'stable'
    }));

    return {
      method: 'Simple Average',
      accuracy: 70,
      forecasts,
      metadata: { historicalDataPoints: quantities.length }
    };
  }

  static determineTrend(predicted, current) {
    const change = ((predicted - current) / current) * 100;
    if (change < -10) return 'declining';
    if (change > 10) return 'increasing';
    return 'stable';
  }
}

// Text Classification for Product Categories (Simple NLP)
class ProductCategorizer {
  constructor() {
    this.categoryKeywords = {
      'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'dairy', 'curd'],
      'Bakery': ['bread', 'cake', 'pastry', 'cookie', 'bun', 'bakery', 'wheat'],
      'Produce': ['vegetable', 'fruit', 'fresh', 'organic', 'apple', 'banana', 'tomato'],
      'Meat': ['chicken', 'beef', 'pork', 'meat', 'lamb', 'turkey', 'mutton'],
      'Seafood': ['fish', 'salmon', 'shrimp', 'seafood', 'tuna', 'crab', 'lobster'],
      'Beverages': ['juice', 'soda', 'water', 'drink', 'beverage', 'tea', 'coffee']
    };
  }

  /**
   * Predict product category using keyword matching
   * @param {string} productName - Product name
   * @returns {Object} Category prediction with confidence
   */
  predictCategory(productName) {
    const name = productName.toLowerCase();
    const scores = {};

    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      scores[category] = keywords.reduce((score, keyword) => {
        return score + (name.includes(keyword) ? 1 : 0);
      }, 0);
    }

    const maxScore = Math.max(...Object.values(scores));
    const predictedCategory = Object.keys(scores).find(cat => scores[cat] === maxScore);
    const confidence = maxScore > 0 ? (maxScore / this.categoryKeywords[predictedCategory].length) : 0;

    return {
      category: predictedCategory || 'Unknown',
      confidence: Math.round(confidence * 100),
      allScores: scores
    };
  }

  /**
   * Add new category with keywords
   * @param {string} category - Category name
   * @param {Array<string>} keywords - Keywords for category
   */
  addCategory(category, keywords) {
    this.categoryKeywords[category] = keywords;
  }
}

module.exports = {
  LinearRegression,
  MovingAverage,
  AnomalyDetector,
  ReorderPointCalculator,
  DemandForecaster,
  ProductCategorizer
};
