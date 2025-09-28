
import React, { useState }from 'react';
import { NAV_ITEMS, ICONS } from '../constants';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  handleLogout: () => void;
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, handleLogout, isSidebarOpen }) => {

  const NavLink: React.FC<{ item: typeof NAV_ITEMS[0] }> = ({ item }) => {
    const isActive = currentPage === item.id;
    return (
      <li key={item.id}>
        <button
          onClick={() => setCurrentPage(item.id)}
          className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
            isActive
              ? 'bg-primary/20 text-primary'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className={`ml-4 font-semibold ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>{item.label}</span>
        </button>
      </li>
    );
  };
    
  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 shadow-md ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700 h-20">
        <ICONS.AiLogo className={`w-10 h-10 text-primary transition-transform duration-300 ${isSidebarOpen ? '' : 'scale-125'}`}/>
        <h1 className={`text-xl font-bold ml-2 text-primary ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>AI Inventory</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => <NavLink key={item.id} item={item} />)}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/50 text-red-500 dark:text-red-400 transition-colors"
        >
          <ICONS.Logout className="w-6 h-6" />
          <span className={`ml-4 font-semibold ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
