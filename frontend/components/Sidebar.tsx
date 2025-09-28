import React from 'react';
import { ADMIN_NAV_ITEMS, MANAGER_NAV_ITEMS, WORKER_NAV_ITEMS, ICONS } from '../constants';
import { Page, UserRole } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  handleLogout: () => void;
  isSidebarOpen: boolean;
  role: UserRole;
}

const getNavItemsByRole = (role: UserRole) => {
    switch (role) {
        case 'Admin':
            return ADMIN_NAV_ITEMS;
        case 'Manager':
            return MANAGER_NAV_ITEMS;
        case 'Worker':
            return WORKER_NAV_ITEMS;
        default:
            return [];
    }
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, handleLogout, isSidebarOpen, role }) => {
  const navItems = getNavItemsByRole(role);

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const isActive = currentPage === item.id;
    return (
      <li key={item.id}>
        <button
          onClick={() => setCurrentPage(item.id)}
          className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group ${
            isActive
              ? 'bg-primary text-white shadow-lg'
              : 'hover:bg-primary/10 text-slate-500 dark:text-slate-400 dark:hover:text-primary'
          }`}
        >
          <item.icon className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-white' : 'group-hover:text-primary'}`} />
          <span className={`ml-4 font-semibold text-left whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>{item.label}</span>
        </button>
      </li>
    );
  };
    
  return (
    <div className={`flex flex-col h-full bg-card-light dark:bg-card-dark shadow-xl ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-center p-4 border-b border-border-light dark:border-border-dark h-20">
        <ICONS.AiLogo className={`w-10 h-10 text-primary transition-transform duration-300 ${isSidebarOpen ? '' : 'scale-125'}`}/>
        <h1 className={`text-2xl font-bold font-heading ml-2 text-primary whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>WMS AI</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => <NavLink key={item.id} item={item} />)}
        </ul>
      </nav>
      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg hover:bg-red-500/10 text-slate-500 dark:text-slate-400 hover:text-accent-red transition-colors duration-200 group"
        >
          <ICONS.Logout className="w-6 h-6 group-hover:text-accent-red" />
          <span className={`ml-4 font-semibold whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;