import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { inventoryService } from '../services/inventoryService';
import { alertService } from '../services/alertService';
import { taskService } from '../services/taskService';

const ManagerDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, alertData, tasksData] = await Promise.all([
        inventoryService.getSummary(),
        alertService.getSummary(),
        taskService.getAll({ limit: 5 }),
      ]);

      setSummary(summaryData);
      setAlerts(alertData);
      setTasks(tasksData.tasks);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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
                {alerts?.breakdown?.expiringSoon || 0}
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

      {/* Alerts Summary */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
        <h2 className="text-2xl font-bold font-heading mb-4">Alert Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Expired Items</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
              {alerts?.breakdown?.expired || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Expiring Soon</p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1">
              {alerts?.breakdown?.expiringSoon || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
              {alerts?.breakdown?.lowStock || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Out of Stock</p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-1">
              {alerts?.breakdown?.outOfStock || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
