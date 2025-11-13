import React from 'react';
import { ICONS } from '../constants';
import SummaryCard from '../components/SummaryCard';
import { useManagerMetrics } from '../hooks/useManagerMetrics'; // Import manager metrics hook
import DemandForecastChart from '../components/DemandForecastChart'; // Import new component

const AdminDashboard: React.FC = () => {
    // Use the same metrics as the Manager
    const metrics = useManagerMetrics();

  return (
    <div className="space-y-6">
      {/* KPI Cards - Same as Manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Pending Tasks" value={metrics.pendingTasks} icon={ICONS.Tasks} color="yellow" />
        <SummaryCard title="Total Inventory Items" value={metrics.totalItems} icon={ICONS.ArchiveBox} color="green" />
        <SummaryCard title="Active Workers" value={metrics.workersOnline} icon={ICONS.UsersGroup} color="blue" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <SummaryCard title="Order Completion" value={metrics.orderCompletionRate} icon={ICONS.Reports} color="green" />
         <SummaryCard title="Low Stock Alerts" value={metrics.lowStockAlertCount} icon={ICONS.ArchiveBox} color="red" />
      </div>

      {/* Demand Forecasting Section */}
      <DemandForecastChart />

      {/* User Management Table has been removed and moved to its own page */}
    </div>
  );
};

export default AdminDashboard;