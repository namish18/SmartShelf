
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_INVENTORY_DATA, INVENTORY_BY_CATEGORY_DATA, DEMAND_FORECAST_DATA, DEMAND_PRODUCT_KEYS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

const SummaryCard: React.FC<{ title: string; value: string; accentColor?: string }> = ({ title, value, accentColor }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col">
    <h3 className="text-gray-500 dark:text-gray-400 font-semibold">{title}</h3>
    <p className={`text-3xl font-bold mt-2 ${accentColor}`}>{value}</p>
  </div>
);

const NearingExpiryTable: React.FC<{ items: typeof MOCK_INVENTORY_DATA }> = ({ items }) => {
    const getRowClass = (expiryDate: string) => {
        const diffDays = (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7 ? 'bg-red-100 dark:bg-red-900/50' : '';
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Products Nearing Expiry</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-3">Product Name</th>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Quantity</th>
                            <th className="p-3">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className={`border-b dark:border-gray-700 ${getRowClass(item.expiryDate)}`}>
                                <td className="p-3">{item.productName}</td>
                                <td className="p-3">{item.sku}</td>
                                <td className="p-3">{item.quantity}</td>
                                <td className="p-3">{item.expiryDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();

  const metrics = useMemo(() => {
    const today = new Date();
    const expiryLimit = new Date();
    expiryLimit.setDate(today.getDate() + 30);

    const totalItems = MOCK_INVENTORY_DATA.reduce((sum, item) => sum + item.quantity, 0);
    const nearingExpiry = MOCK_INVENTORY_DATA.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        return expiryDate > today && expiryDate <= expiryLimit;
    }).length;
    const expired = MOCK_INVENTORY_DATA.filter(item => new Date(item.expiryDate) < today).length;
    const stockValue = MOCK_INVENTORY_DATA.reduce((sum, item) => sum + item.quantity * 3.5, 0); // Assuming avg price

    const topNearingExpiry = MOCK_INVENTORY_DATA
        .filter(item => new Date(item.expiryDate) > today)
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
        .slice(0, 10);

    return { totalItems, nearingExpiry, expired, stockValue, topNearingExpiry };
  }, []);

  const tooltipContentStyle = {
    backgroundColor: theme === 'dark' ? '#1A1A1D' : '#F8F9FA',
    border: 'none',
    borderRadius: '0.5rem',
  };

  const textStyle = {
    color: theme === 'dark' ? '#E1E1E1' : '#343A40',
  };
  
  const axisTickStyle = {
    fill: theme === 'dark' ? '#E1E1E1' : '#343A40',
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Items" value={metrics.totalItems.toLocaleString()} />
        <SummaryCard title="Items Nearing Expiry" value={metrics.nearingExpiry.toString()} accentColor="text-accent-yellow" />
        <SummaryCard title="Expired Items" value={metrics.expired.toString()} accentColor="text-accent-red" />
        <SummaryCard title="Stock Value" value={`$${metrics.stockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Inventory by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={INVENTORY_BY_CATEGORY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
              <XAxis dataKey="name" tick={axisTickStyle} />
              <YAxis tick={axisTickStyle} />
              <Tooltip 
                contentStyle={tooltipContentStyle} 
                itemStyle={textStyle} 
                labelStyle={textStyle} 
              />
              <Legend wrapperStyle={textStyle} />
              <Bar dataKey="quantity" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Predictive Demand Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={DEMAND_FORECAST_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
              <XAxis dataKey="month" tick={axisTickStyle} />
              <YAxis tick={axisTickStyle} />
              <Tooltip 
                contentStyle={tooltipContentStyle} 
                itemStyle={textStyle} 
                labelStyle={textStyle}
              />
              <Legend wrapperStyle={textStyle} />
              {DEMAND_PRODUCT_KEYS.map(p => <Line key={p.key} type="monotone" dataKey={p.key} stroke={p.color} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <NearingExpiryTable items={metrics.topNearingExpiry} />
    </div>
  );
};

export default DashboardPage;