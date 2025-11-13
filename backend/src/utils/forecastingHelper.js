// Calculate moving average
exports.calculateMovingAverage = (dataPoints, periods = 3) => {
  if (dataPoints.length < periods) {
    return dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length;
  }

  const recentData = dataPoints.slice(-periods);
  return recentData.reduce((sum, val) => sum + val, 0) / periods;
};

// Calculate consumption rate (units per day)
exports.calculateConsumptionRate = (currentQuantity, daysSincePurchase, initialQuantity) => {
  if (daysSincePurchase <= 0) return 0;
  
  const consumed = initialQuantity - currentQuantity;
  return consumed / daysSincePurchase;
};

// Calculate reorder point
exports.calculateReorderPoint = (consumptionRate, leadTimeDays, safetyStock) => {
  return (consumptionRate * leadTimeDays) + safetyStock;
};

// Predict demand trend using simple linear regression
exports.predictDemandTrend = (historicalQuantities, futurePeriods) => {
  const n = historicalQuantities.length;
  if (n < 2) return historicalQuantities;

  // Calculate slope (m) and intercept (b) for y = mx + b
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += historicalQuantities[i];
    sumXY += i * historicalQuantities[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Predict future values
  const predictions = [];
  for (let i = n; i < n + futurePeriods; i++) {
    const predicted = Math.max(0, Math.round(slope * i + intercept));
    predictions.push(predicted);
  }

  return predictions;
};

// Calculate exponential moving average (for more weight on recent data)
exports.calculateEMA = (dataPoints, smoothingFactor = 0.3) => {
  if (dataPoints.length === 0) return 0;
  if (dataPoints.length === 1) return dataPoints[0];

  let ema = dataPoints[0];
  for (let i = 1; i < dataPoints.length; i++) {
    ema = smoothingFactor * dataPoints[i] + (1 - smoothingFactor) * ema;
  }

  return ema;
};

// Calculate standard deviation for demand variability
exports.calculateStandardDeviation = (dataPoints) => {
  if (dataPoints.length === 0) return 0;

  const mean = dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length;
  const squaredDiffs = dataPoints.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / dataPoints.length;

  return Math.sqrt(variance);
};
