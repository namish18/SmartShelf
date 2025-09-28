import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ICONS } from '../constants';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
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