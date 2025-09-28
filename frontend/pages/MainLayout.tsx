import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import { Page, UserRole } from '../types';
import { ICONS } from '../constants';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import WorkerDashboard from './WorkerDashboard';
import InventoryPage from './InventoryPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';

interface MainLayoutProps {
  user: { name: string; role: UserRole };
  handleLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const getDefaultPage = (role: UserRole): Page => {
    switch (role) {
      case 'Admin': return Page.Dashboard;
      case 'Manager': return Page.Dashboard;
      case 'Worker': return Page.MyTasks;
      default: return Page.Dashboard;
    }
  };

  const [currentPage, setCurrentPage] = useState<Page>(getDefaultPage(user.role));
  
  useEffect(() => {
    setCurrentPage(getDefaultPage(user.role));
  }, [user.role]);


  const renderPage = (page: Page) => {
    switch (page) {
        case Page.Inventory: return <InventoryPage />;
        case Page.Reports: return <ReportsPage />;
        case Page.Settings: return <SettingsPage />;
        
        case Page.Dashboard:
            if (user.role === 'Admin') return <AdminDashboard />;
            if (user.role === 'Manager') return <ManagerDashboard />;
            return <div>Dashboard not available for this role.</div>;

        case Page.UserManagement:
             if (user.role === 'Admin') {
                setCurrentPage(Page.Dashboard);
                return <AdminDashboard />;
             }
             return <div>Access Denied</div>;

        case Page.TaskManagement:
            if (user.role === 'Manager') {
                setCurrentPage(Page.Dashboard);
                return <ManagerDashboard />;
            }
            return <div>Access Denied</div>;

        case Page.MyTasks:
            if (user.role === 'Worker') return <WorkerDashboard />;
            return <div>Access Denied</div>;
            
        default:
            return <AdminDashboard />;
    }
};


  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      <div className="fixed top-0 left-0 h-full z-30 md:relative">
         <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            handleLogout={handleLogout} 
            isSidebarOpen={isSidebarOpen}
            role={user.role}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-6 border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark h-20">
          <div className="flex items-center">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 mr-4 transition-colors">
                <ICONS.Menu className="w-6 h-6" />
             </button>
             <h1 className="text-2xl font-bold font-heading">
                  {currentPage}
              </h1>
          </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
              </div>
              <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8 animate-fade-in">
          {renderPage(currentPage)}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;