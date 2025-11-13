import React from 'react';
import { ICONS } from '../constants';
import SummaryCard from '../components/SummaryCard';
import { useManagerMetrics } from '../hooks/useManagerMetrics';
import DemandForecastChart from '../components/DemandForecastChart'; // Import new component

const ManagerDashboard: React.FC = () => {
    const metrics = useManagerMetrics();

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard title="Pending Tasks" value={metrics.pendingTasks} icon={ICONS.Tasks} color="yellow" />
                <SummaryCard title="Total Inventory Items" value={metrics.totalItems} icon={ICONS.ArchiveBox} color="green" />
                <SummaryCard title="Active Workers" value={metrics.workersOnline} icon={ICONS.UsersGroup} color="blue" />
            </div>
            {/* Second row of KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <SummaryCard title="Order Completion" value={metrics.orderCompletionRate} icon={ICONS.Reports} color="green" />
                 <SummaryCard title="Low Stock Alerts" value={metrics.lowStockAlertCount} icon={ICONS.ArchiveBox} color="red" />
            </div>

            {/* Alerts Section */}
            {(metrics.lowStockItems.length > 0 || metrics.expiringSoonItems.length > 0) && (
                 <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                    <h3 className="text-xl font-bold font-heading mb-4">Alerts</h3>
                    <div className="space-y-3">
                        {metrics.lowStockItems.map(item => (
                            <div key={`low-${item.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20">
                                <div className="flex-shrink-0 p-2 bg-accent-red/20 rounded-full">
                                    <ICONS.ArchiveBox className="w-5 h-5 text-accent-red" />
                                </div>
                                <div>
                                    <span className="font-semibold text-accent-red">Low Stock:</span>
                                    <span className="ml-2">{item.productName} has only {item.quantity} units left.</span>
                                </div>
                            </div>
                        ))}
                         {metrics.expiringSoonItems.map(item => (
                            <div key={`exp-${item.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-accent-yellow/10 border border-accent-yellow/20">
                                 <div className="flex-shrink-0 p-2 bg-accent-yellow/20 rounded-full">
                                    <ICONS.Reports className="w-5 h-5 text-accent-yellow" />
                                </div>
                                <div>
                                    <span className="font-semibold text-accent-yellow">Nearing Expiry:</span>
                                    <span className="ml-2">{item.productName} ({item.sku}) expires in {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'}.</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* FEFO Section */}
                <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                    <h3 className="text-xl font-bold font-heading mb-4">First Expiry First Out (FEFO)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Prioritize these items for picking and dispatch to minimize waste.
                    </p>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark">
                                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-slate-500">SKU</th>
                                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Expires In</th>
                                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.expiringSoonItems.length > 0 ? metrics.expiringSoonItems.map(item => (
                                    <tr key={item.id} className="border-b border-border-light dark:border-border-dark last:border-b-0">
                                        <td className="p-3 font-medium">{item.productName}</td>
                                        <td className="p-3 text-slate-500 dark:text-slate-400">{item.sku}</td>
                                        <td className="p-3">
                                            <span className={`font-medium ${item.daysLeft <= 3 ? 'text-accent-red' : 'text-accent-yellow'}`}>
                                                {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'}
                                            </span>
                                        </td>
                                        <td className="p-3 font-medium">{item.quantity}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-slate-500">No items are expiring soon.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Products Section */}
                <div className="lg:col-span-1 bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                    <h3 className="text-xl font-bold font-heading mb-4">Top Selling Products</h3>
                    <div className="space-y-4">
                        {metrics.topSellingItems.map((item, index) => (
                             <div key={item.id} className="flex items-center gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                    index === 1 ? 'bg-slate-400 text-slate-900' :
                                    index === 2 ? 'bg-yellow-700 text-yellow-100' : 'bg-slate-200 dark:bg-slate-700'
                                }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.productName}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{item.unitsSold}</p>
                                    <p className="text-xs text-slate-500">units</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NEW Demand Forecasting Section */}
            <DemandForecastChart />
        </div>
    );
};

export default ManagerDashboard;