
import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Compliance Reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Generate and view compliance and historical data reports.
        </p>
        <button className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300">
          Generate New Report
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;
