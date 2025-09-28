import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ICONS } from '../constants';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <ICONS.Moon className="w-6 h-6" />
      ) : (
        <ICONS.Sun className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggle;