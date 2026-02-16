import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

interface AnomalyReport {
  product: {
    id: string;
    name: string;
    category: string;
    currentQuantity: number;
  };
  anomaliesCount: number;
  severity: string;
  recommendation: string;
}

interface ReorderRecommendation {
  product: {
    id: string;
    name: string;
    category: string;
    currentQuantity: number;
  };
  reorderPoint: number;
  safetyStock: number;
  shouldReorder: boolean;
  urgency: string;
  recommendedOrderQuantity: number;
  confidence: string;
}

const AIInsightsPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [reorderPoints, setReorderPoints] = useState<ReorderRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'anomalies' | 'reorder' | 'categorize'>('anomalies');

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);

      // Fetch anomalies
      const anomalyRes = await fetch('http://localhost:5000/api/forecast/anomalies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const anomalyData = await anomalyRes.json();
      setAnomalies(anomalyData.data.anomalyReports || []);

      // Fetch reorder points
      const reorderRes = await fetch('http://localhost:5000/api/forecast/reorder-points', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const reorderData = await reorderRes.json();
      setReorderPoints(reorderData.data.recommendations || []);

    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
        <h1 className="text-3xl font-bold font-heading mb-2">🤖 AI-Powered Insights</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Machine Learning algorithms analyzing your inventory for intelligent recommendations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-light dark:border-border-dark">
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 \${
            activeTab === 'anomalies'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-primary'
          }`}
        >
          🔍 Anomaly Detection
        </button>
        <button
          onClick={() => setActiveTab('reorder')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 \${
            activeTab === 'reorder'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-primary'
          }`}
        >
          📊 Smart Reorder Points
        </button>
      </div>

      {/* Anomaly Detection Tab */}
      {activeTab === 'anomalies' && (
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Anomaly Detection</h2>
            <span className="text-sm text-slate-500">
              Algorithm: Z-Score Statistical Analysis
            </span>
          </div>

          {anomalies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                No Anomalies Detected
              </p>
              <p className="text-slate-500 mt-2">All stock levels are within normal ranges</p>
            </div>
          ) : (
            <div className="space-y-4">
              {anomalies.map((report) => (
                <div
                  key={report.product.id}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{report.product.name}</h3>
                      <p className="text-sm text-slate-500">
                        Category: {report.product.category} • Current Stock: {report.product.currentQuantity}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold \${getSeverityColor(report.severity)}`}>
                      {report.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>

                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      🎯 AI Recommendation:
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {report.recommendation}
                    </p>
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    {report.anomaliesCount} anomalous data points detected
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Smart Reorder Points Tab */}
      {activeTab === 'reorder' && (
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Smart Reorder Recommendations</h2>
            <span className="text-sm text-slate-500">
              Algorithm: Statistical Safety Stock Calculation
            </span>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Critical Orders</p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-1">
                {reorderPoints.filter(r => r.urgency === 'critical').length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">High Priority</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300 mt-1">
                {reorderPoints.filter(r => r.urgency === 'high').length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Well Stocked</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-1">
                {reorderPoints.filter(r => r.urgency === 'normal').length}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reorderPoints
              .filter(r => r.shouldReorder)
              .map((rec) => (
                <div
                  key={rec.product.id}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{rec.product.name}</h3>
                      <p className="text-sm text-slate-500">{rec.product.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold \${getUrgencyColor(rec.urgency)}`}>
                      {rec.urgency.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded">
                      <p className="text-xs text-slate-500">Current Stock</p>
                      <p className="text-lg font-bold">{rec.product.currentQuantity}</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded">
                      <p className="text-xs text-slate-500">Reorder Point</p>
                      <p className="text-lg font-bold text-orange-600">{rec.reorderPoint}</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded">
                      <p className="text-xs text-slate-500">Safety Stock</p>
                      <p className="text-lg font-bold text-blue-600">{rec.safetyStock}</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded">
                      <p className="text-xs text-slate-500">Order Qty</p>
                      <p className="text-lg font-bold text-green-600">{rec.recommendedOrderQuantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Confidence: {rec.confidence}
                    </span>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                      Create Purchase Order
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPage;
