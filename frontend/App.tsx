import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import MainLayout from './pages/MainLayout';
import { Page } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage(Page.Dashboard);
    setAuthPage('login'); // Reset to login on logout
  };

  return (
    <ThemeProvider value={themeValue}>
      <div className="bg-light-bg dark:bg-dark-bg min-h-screen text-light-text dark:text-dark-text transition-colors duration-300">
        {isLoggedIn ? (
          <MainLayout 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            handleLogout={handleLogout}
          />
        ) : (
          authPage === 'login' ? (
            <LoginPage 
              onLogin={handleLogin} 
              onSwitchToRegister={() => setAuthPage('register')}
            />
          ) : (
            <RegistrationPage 
              onRegister={handleLogin} 
              onSwitchToLogin={() => setAuthPage('login')}
            />
          )
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;