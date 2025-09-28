
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardPage from './DashboardPage';
import InventoryPage from './InventoryPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import ThemeToggle from '../components/ThemeToggle';
import { Page } from '../types';
import { ICONS } from '../constants';

interface MainLayoutProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  handleLogout: () => void;
}

const renderPage = (page: Page) => {
  switch (page) {
    case Page.Dashboard:
      return <DashboardPage />;
    case Page.Inventory:
      return <InventoryPage />;
    case Page.Reports:
        return <ReportsPage />;
    case Page.Settings:
        return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
};

const MainLayout: React.FC<MainLayoutProps> = ({ currentPage, setCurrentPage, handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
      <div className="fixed top-0 left-0 h-full z-30 md:relative">
         <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            handleLogout={handleLogout} 
            isSidebarOpen={isSidebarOpen}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800 h-20">
          <div className="flex items-center">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-4">
                <ICONS.Menu className="w-6 h-6" />
             </button>
             <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
                Welcome back, Admin!
             </h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderPage(currentPage)}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
