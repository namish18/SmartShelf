import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading">Compliance Reports</h1>
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-lg text-center">
        
        <h2 className="text-2xl font-bold mb-4 font-heading">Generate Reports</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
          Generate and view compliance and historical data reports. Select a report type and date range to get started.
        </p>
        <button className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors duration-300 shadow-lg hover:shadow-primary/40">
          Generate New Report
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;