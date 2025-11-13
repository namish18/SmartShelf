import React from 'react';
import { DEMAND_FORECAST_DATA, ICONS } from '../constants';

const DemandForecastChart: React.FC = () => {
  // Get the keys for the products (e.g., 'Organic Milk', 'Apples', 'Chicken Breast')
  // Assumes all data points have the same product keys
  const productKeys = Object.keys(DEMAND_FORECAST_DATA[0]).filter(key => key !== 'month');

  return (
    <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
      <div className="flex items-center gap-3 mb-4">
        <ICONS.AiLogo className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold font-heading">Demand Forecasting</h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Predictive analytics for upcoming product demand based on historical data and market trends.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              <th className="p-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Forecast Period</th>
              {productKeys.map(key => (
                <th key={key} className="p-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Est. {key} (units)</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEMAND_FORECAST_DATA.map((data, index) => (
              <tr key={index} className="border-b border-border-light dark:border-border-dark last:border-b-0">
                <td className="p-3 font-medium">{data.month}</td>
                {productKeys.map(key => (
                  <td key={key} className="p-3 font-medium text-slate-500 dark:text-slate-400 text-right">
                    {data[key as keyof typeof data]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemandForecastChart;