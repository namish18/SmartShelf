import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { inventoryService } from '../services/inventoryService';
import { alertService } from '../services/alertService';
import { taskService } from '../services/taskService';

interface Alert {
  id: string;
  type: string;
  severity: string;
  productName: string;
  category: string;
  message: string;
  timestamp: string;
}

interface FEFOItem {
  id: string;
  productName: string;
  category: string;
  sku: string;
  quantity: number;
  expiryDate: string;
  daysUntilExpiry: number;
  urgency: string;
  supplier: string;
}

interface ForecastData {
  product: {
    id: string;
    name: string;
    category: string;
    sku: string;
    currentQuantity: number;
  };
  forecast: Array<{
    day: number;
    date: string;
    projectedQuantity: number;
    trend: string;
  }>;
  estimatedDailyConsumption: number;
}

interface TopSellingProduct {
  id: string;
  productName: string;
  category: string;
  sku: string;
  currentQuantity: number;
  estimatedSold: number;
  salesVelocity: number;
  daysSincePurchase: number;
}

const ManagerDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [fefoItems, setFefoItems] = useState<FEFOItem[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [summaryData, tasksData] = await Promise.all([
        inventoryService.getSummary(),
        taskService.getAll({ limit: 5 }),
      ]);

      setSummary(summaryData);
      setTasks(tasksData.tasks);

      // Fetch analytics data (these would be real API calls)
      await fetchAnalyticsData();
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    // Mock data for now - replace with actual API calls
    // Real API: const response = await fetch('/api/analytics/notification-alerts');
    
    // Mock Notification Alerts
    setAlerts([
      {
        id: '1',
        type: 'expiring_soon',
        severity: 'high',
        productName: 'Fresh Milk',
        category: 'Dairy',
        message: 'Fresh Milk is expiring in 2 days',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'out_of_stock',
        severity: 'high',
        productName: 'Whole Wheat Bread',
        category: 'Bakery',
        message: 'Whole Wheat Bread is out of stock',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        type: 'low_stock',
        severity: 'medium',
        productName: 'Organic Eggs',
        category: 'Dairy',
        message: 'Organic Eggs is running low (7 units remaining)',
        timestamp: new Date().toISOString()
      },
      {
        id: '4',
        type: 'expiring_soon',
        severity: 'critical',
        productName: 'Greek Yogurt',
        category: 'Dairy',
        message: 'Greek Yogurt is expiring in 1 day',
        timestamp: new Date().toISOString()
      },
      {
        id: '5',
        type: 'low_stock',
        severity: 'high',
        productName: 'Chicken Breast',
        category: 'Meat',
        message: 'Chicken Breast is running low (3 units remaining)',
        timestamp: new Date().toISOString()
      }
    ]);

    // Mock FEFO Items
    setFefoItems([
      {
        id: '1',
        productName: 'Fresh Milk',
        category: 'Dairy',
        sku: 'DA-001',
        quantity: 25,
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilExpiry: 2,
        urgency: 'critical',
        supplier: 'Local Dairy Farm'
      },
      {
        id: '2',
        productName: 'Greek Yogurt',
        category: 'Dairy',
        sku: 'DA-003',
        quantity: 15,
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilExpiry: 3,
        urgency: 'critical',
        supplier: 'Dairy Co.'
      },
      {
        id: '3',
        productName: 'Organic Eggs',
        category: 'Dairy',
        sku: 'DA-002',
        quantity: 7,
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilExpiry: 5,
        urgency: 'high',
        supplier: 'Farm Fresh'
      },
      {
        id: '4',
        productName: 'Chicken Breast',
        category: 'Meat',
        sku: 'ME-001',
        quantity: 20,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilExpiry: 7,
        urgency: 'high',
        supplier: 'Meat Masters'
      },
      {
        id: '5',
        productName: 'Salmon Fillet',
        category: 'Seafood',
        sku: 'SF-001',
        quantity: 12,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilExpiry: 10,
        urgency: 'medium',
        supplier: 'Ocean Catch'
      }
    ]);

    // Mock Demand Forecast
    setForecastData([
      {
        product: {
          id: '1',
          name: 'Fresh Milk',
          category: 'Dairy',
          sku: 'DA-001',
          currentQuantity: 150
        },
        forecast: [
          { day: 1, date: '2025-11-16', projectedQuantity: 145, trend: 'stable' },
          { day: 2, date: '2025-11-17', projectedQuantity: 140, trend: 'stable' },
          { day: 3, date: '2025-11-18', projectedQuantity: 135, trend: 'stable' },
          { day: 4, date: '2025-11-19', projectedQuantity: 130, trend: 'normal' },
          { day: 5, date: '2025-11-20', projectedQuantity: 125, trend: 'normal' },
          { day: 6, date: '2025-11-21', projectedQuantity: 120, trend: 'normal' },
          { day: 7, date: '2025-11-22', projectedQuantity: 115, trend: 'normal' }
        ],
        estimatedDailyConsumption: 5.2
      },
      {
        product: {
          id: '2',
          name: 'Whole Wheat Bread',
          category: 'Bakery',
          sku: 'BK-001',
          currentQuantity: 80
        },
        forecast: [
          { day: 1, date: '2025-11-16', projectedQuantity: 75, trend: 'stable' },
          { day: 2, date: '2025-11-17', projectedQuantity: 70, trend: 'stable' },
          { day: 3, date: '2025-11-18', projectedQuantity: 65, trend: 'stable' },
          { day: 4, date: '2025-11-19', projectedQuantity: 60, trend: 'normal' },
          { day: 5, date: '2025-11-20', projectedQuantity: 55, trend: 'normal' },
          { day: 6, date: '2025-11-21', projectedQuantity: 50, trend: 'normal' },
          { day: 7, date: '2025-11-22', projectedQuantity: 45, trend: 'normal' }
        ],
        estimatedDailyConsumption: 5.0
      },
      {
        product: {
          id: '3',
          name: 'Chicken Breast',
          category: 'Meat',
          sku: 'ME-001',
          currentQuantity: 45
        },
        forecast: [
          { day: 1, date: '2025-11-16', projectedQuantity: 42, trend: 'stable' },
          { day: 2, date: '2025-11-17', projectedQuantity: 39, trend: 'stable' },
          { day: 3, date: '2025-11-18', projectedQuantity: 36, trend: 'stable' },
          { day: 4, date: '2025-11-19', projectedQuantity: 33, trend: 'normal' },
          { day: 5, date: '2025-11-20', projectedQuantity: 30, trend: 'normal' },
          { day: 6, date: '2025-11-21', projectedQuantity: 27, trend: 'normal' },
          { day: 7, date: '2025-11-22', projectedQuantity: 24, trend: 'normal' }
        ],
        estimatedDailyConsumption: 3.2
      }
    ]);

    // Mock Top Selling Products
    setTopSellingProducts([
      {
        id: '1',
        productName: 'Fresh Milk',
        category: 'Dairy',
        sku: 'DA-001',
        currentQuantity: 150,
        estimatedSold: 85,
        salesVelocity: 12.1,
        daysSincePurchase: 7
      },
      {
        id: '2',
        productName: 'Whole Wheat Bread',
        category: 'Bakery',
        sku: 'BK-001',
        currentQuantity: 80,
        estimatedSold: 70,
        salesVelocity: 10.0,
        daysSincePurchase: 7
      },
      {
        id: '3',
        productName: 'Organic Eggs',
        category: 'Dairy',
        sku: 'DA-002',
        currentQuantity: 35,
        estimatedSold: 45,
        salesVelocity: 6.4,
        daysSincePurchase: 7
      },
      {
        id: '4',
        productName: 'Greek Yogurt',
        category: 'Dairy',
        sku: 'DA-003',
        currentQuantity: 60,
        estimatedSold: 40,
        salesVelocity: 5.7,
        daysSincePurchase: 7
      },
      {
        id: '5',
        productName: 'Chicken Breast',
        category: 'Meat',
        sku: 'ME-001',
        currentQuantity: 45,
        estimatedSold: 35,
        salesVelocity: 5.0,
        daysSincePurchase: 7
      }
    ]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      default:
        return '🔵';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Pending':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };
  
  const REORDER_THRESHOLD = 10;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const calcLinearRegression = (y: number[]) => {
    const n = y.length;
    const x = Array.from({ length: n }, (_, i) => i + 1);
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;
    let sxx = 0, sxy = 0, sst = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - xMean;
      const dy = y[i] - yMean;
      sxx += dx * dx;
      sxy += dx * dy;
      sst += dy * dy;
    }
    const slope = sxx === 0 ? 0 : sxy / sxx;
    const intercept = yMean - slope * xMean;
    const yhat = x.map(xi => slope * xi + intercept);
    let sse = 0;
    for (let i = 0; i < n; i++) sse += (y[i] - yhat[i]) ** 2;
    const r2 = sst === 0 ? 1 : clamp(1 - sse / sst, 0, 1);
    return { slope, intercept, yhat, r2 };
  };

  const calcMovingAverage = (y: number[], window = 3) => {
    const n = y.length;
    const out: number[] = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - window + 1);
      const slice = y.slice(start, i + 1);
      out[i] = slice.reduce((a, b) => a + b, 0) / slice.length;
    }
    return out;
  };

  const rmse = (a: number[], b: number[]) => {
    const n = a.length;
    let s = 0;
    for (let i = 0; i < n; i++) s += (a[i] - b[i]) ** 2;
    return Math.sqrt(s / Math.max(1, n));
  };

  const toPercent = (v: number) => `${Math.round(v)}%`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Items</p>
              <h3 className="text-3xl font-bold mt-1">{summary?.totalItems || 0}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <ICONS.ArchiveBox className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Low Stock</p>
              <h3 className="text-3xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {summary?.lowStockCount || 0}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <ICONS.ArchiveBox className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Expiring Soon</p>
              <h3 className="text-3xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {summary?.expiringSoonCount || 0}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <ICONS.ArchiveBox className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Tasks</p>
              <h3 className="text-3xl font-bold mt-1">{tasks.filter(t => t.status !== 'Completed').length}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <ICONS.Tasks className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Alerts - Notification Style */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold font-heading">Live Alerts</h2>
          <span className="text-sm text-slate-500">{alerts.length} active alerts</span>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xl mt-0.5">{getSeverityIcon(alert.severity)}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.message}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {alert.category} • Just now
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demand Forecasting */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
        <h2 className="text-2xl font-bold font-heading mb-4">Demand Forecasting</h2>

        <div className="flex gap-3 mb-5 overflow-x-auto pb-2">
          {forecastData.map((item, index) => (
            <button
              key={item.product.id}
              onClick={() => setSelectedForecast(index)}
              className={`min-w-[210px] text-left p-4 rounded-xl border transition-all duration-200 shadow-sm ${
                selectedForecast === index
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                  : 'border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.product.category}</p>
                  <p className="font-semibold mt-0.5">{item.product.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Stock</p>
                  <p className="text-lg font-bold">{item.product.currentQuantity}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {forecastData[selectedForecast] && (() => {
          const sel = forecastData[selectedForecast];
          const y = sel.forecast.map(d => d.projectedQuantity);
          const days = sel.forecast.map(d => d.day);
          const reg = calcLinearRegression(y);
          const ma = calcMovingAverage(y, 3);
          const ensemble = y;
          const allVals = [...ensemble, ...reg.yhat, ...ma];
          const minV = Math.min(...allVals);
          const maxV = Math.max(...allVals);
          const pad = Math.max(10, (maxV - minV) * 0.1);
          const minY = minV - pad;
          const maxY = maxV + pad;
          const range = Math.max(1, maxY - minY);

          const nrmseReg = rmse(ensemble, reg.yhat) / (Math.max(1, Math.max(...ensemble) - Math.min(...ensemble)));
          const nrmseMA = rmse(ensemble, ma) / (Math.max(1, Math.max(...ensemble) - Math.min(...ensemble)));
          const confRegression = clamp((1 - nrmseReg) * 100, 0, 100);
          const confMA = clamp((1 - nrmseMA) * 100, 0, 100);
          const confEnsemble = (confRegression + confMA) / 2;

          const pctChange = (ensemble[ensemble.length - 1] - ensemble[0]) / Math.max(1, ensemble[0]);
          const trend = pctChange > 0.02 ? 'increasing' : pctChange < -0.02 ? 'declining' : 'stable';
          const trendStrength = clamp(Math.abs(pctChange) * 100, 0, 100);
          const trendArrow = trend === 'increasing' ? '↗' : trend === 'declining' ? '↘' : '→';
          const trendBadge = trend === 'increasing'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
            : trend === 'declining'
            ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';

          const reorderIdx = ensemble.findIndex(v => v <= REORDER_THRESHOLD);
          const reorderText = reorderIdx === -1 ? '> 7 days' : `${reorderIdx + 1} day(s)`;

          // chart helpers
          const W = 700, H = 260;
          const m = { top: 20, right: 16, bottom: 30, left: 40 };
          const cw = W - m.left - m.right;
          const ch = H - m.top - m.bottom;
          const xFor = (i: number) => m.left + (cw * (days[i] - 1)) / Math.max(1, days.length - 1);
          const yFor = (v: number) => m.top + ch - ((v - minY) / range) * ch;
          const pts = (arr: number[]) => arr.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ');

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Current Stock Level</p>
                  <p className="text-2xl font-bold mt-1">{sel.product.currentQuantity}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Daily Consumption Rate</p>
                  <p className="text-2xl font-bold mt-1">{sel.estimatedDailyConsumption}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Forecast Accuracy Score</p>
                  <p className="text-2xl font-bold mt-1">{toPercent(confEnsemble)}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Days Until Reorder Needed</p>
                  <p className="text-2xl font-bold mt-1">{reorderText}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">7-Day Projection</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1"><span className="text-primary">●</span> Ensemble</span>
                    <span className="flex items-center gap-1"><span className="text-slate-500">○</span> Linear Regression</span>
                    <span className="flex items-center gap-1"><span className="text-sky-500">△</span> Moving Average</span>
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]">
                    <line x1={m.left} y1={H - m.bottom} x2={W - m.right} y2={H - m.bottom} stroke="#cbd5e1" strokeWidth={1} />
                    <line x1={m.left} y1={m.top} x2={m.left} y2={H - m.bottom} stroke="#cbd5e1" strokeWidth={1} />
                    <polyline points={pts(ensemble)} fill="none" stroke="currentColor" className="text-primary" strokeWidth={2.5} />
                    <polyline points={pts(reg.yhat)} fill="none" stroke="currentColor" className="text-slate-500" strokeWidth={2} strokeDasharray="2,6" />
                    <polyline points={pts(ma)} fill="none" stroke="currentColor" className="text-sky-500" strokeWidth={2} strokeDasharray="6,6" />
                    {ensemble.map((v, i) => (
                      <circle key={`e-${i}`} cx={xFor(i)} cy={yFor(v)} r={3.5} fill="currentColor" className="text-primary">
                        <title>{`Day ${days[i]} • Ensemble: ${v}`}</title>
                      </circle>
                    ))}
                    {reg.yhat.map((v, i) => (
                      <circle key={`r-${i}`} cx={xFor(i)} cy={yFor(v)} r={3} fill="#fff" stroke="#64748b" strokeWidth={1.5}>
                        <title>{`Day ${days[i]} • Regression: ${v.toFixed(1)}`}</title>
                      </circle>
                    ))}
                    {ma.map((v, i) => (
                      <circle key={`m-${i}`} cx={xFor(i)} cy={yFor(v)} r={3} fill="#fff" stroke="#0ea5e9" strokeWidth={1.5}>
                        <title>{`Day ${days[i]} • Moving Avg: ${v.toFixed(1)}`}</title>
                      </circle>
                    ))}
                    {days.map((d, i) => (
                      <text key={`xl-${i}`} x={xFor(i)} y={H - m.bottom + 18} textAnchor="middle" className="fill-slate-500 text-[10px]">D{d}</text>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${trendBadge}`}>
                  <div className="text-sm font-semibold">Trend</div>
                  <div className="mt-1 text-xl font-bold flex items-center gap-2">
                    <span>{trend === 'increasing' ? '🟢' : trend === 'declining' ? '🔴' : '🟡'}</span>
                    <span className="capitalize">{trend}</span>
                    <span className="opacity-70">{trendArrow}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
                  <div className="text-sm text-slate-500">Trend Strength</div>
                  <div className="mt-1 text-xl font-bold">{toPercent(trendStrength)}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
                  <div className="text-sm text-slate-500">Regression R²</div>
                  <div className="mt-1 text-xl font-bold">{toPercent(reg.r2 * 100)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>Ensemble</span><span>{toPercent(confEnsemble)}</span></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded">
                      <div className="h-2 bg-primary rounded" style={{ width: `${confEnsemble}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>Linear Regression</span><span>{toPercent(confRegression)}</span></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded">
                      <div className="h-2 bg-slate-500 rounded" style={{ width: `${confRegression}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>Moving Average</span><span>{toPercent(confMA)}</span></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded">
                      <div className="h-2 bg-sky-500 rounded" style={{ width: `${confMA}%` }} />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border-light dark:border-border-dark">
                        <th className="py-2 pr-3">Model</th>
                        <th className="py-2 pr-3">Score</th>
                        <th className="py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border-light dark:border-border-dark">
                        <td className="py-2 pr-3">Ensemble</td>
                        <td className="py-2 pr-3 font-semibold">{toPercent(confEnsemble)}</td>
                        <td className="py-2">Primary signal (from system forecast)</td>
                      </tr>
                      <tr className="border-b border-border-light dark:border-border-dark">
                        <td className="py-2 pr-3">Linear Regression</td>
                        <td className="py-2 pr-3 font-semibold">{toPercent(confRegression)}</td>
                        <td className="py-2">Dotted line (trend fit)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3">Moving Average</td>
                        <td className="py-2 pr-3 font-semibold">{toPercent(confMA)}</td>
                        <td className="py-2">Dashed line (smoothing)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FEFO Ordering */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <h2 className="text-2xl font-bold font-heading mb-4">FEFO Ordering</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            First Expired, First Out - Priority dispatch order
          </p>
          <div className="space-y-3">
            {fefoItems.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                        #{index + 1}
                      </span>
                      <h3 className="font-semibold">{item.productName}</h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.category} • SKU: {item.sku}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(item.urgency)}`}>
                    {item.daysUntilExpiry}d left
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Qty: <strong>{item.quantity}</strong>
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.supplier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <h2 className="text-2xl font-bold font-heading mb-4">Top Selling Products</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Based on sales velocity (units/day)
          </p>
          <div className="space-y-3">
            {topSellingProducts.map((product, index) => (
              <div
                key={product.id}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        #{index + 1}
                      </span>
                      <h3 className="font-semibold">{product.productName}</h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {product.category} • SKU: {product.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{product.salesVelocity}</p>
                    <p className="text-xs text-slate-500">units/day</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Stock: <strong>{product.currentQuantity}</strong>
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    Sold: <strong>{product.estimatedSold}</strong> units
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
        <h2 className="text-2xl font-bold font-heading mb-4">Recent Tasks</h2>
        <div className="space-y-3">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <p className="font-medium">{task.description}</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-slate-500 py-8">No tasks found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
