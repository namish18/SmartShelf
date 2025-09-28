import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading">Reports</h1>
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-border-light dark:border-border-dark text-center">
        
        <h2 className="text-2xl font-bold mb-4 font-heading">Generate Compliance Reports</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
          Select a report type and date range to generate and view compliance and historical data reports.
        </p>
        <button className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors duration-300">
          Generate New Report
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;