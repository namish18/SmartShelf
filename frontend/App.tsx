import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import MainLayout from './pages/MainLayout';
import { User } from './types';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error('Auth check failed:', error);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authService.login({ email, password });
      setCurrentUser(user);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };
  
  const handleRegister = async (name: string, email: string, role: string, password: string) => {
    try {
      const user = await authService.register({ name, email, password, role: role as any });
      setCurrentUser(user);
      setAuthView('login');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setAuthView('login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-light-text dark:text-dark-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider value={themeValue}>
      <div className="bg-light-bg dark:bg-dark-bg min-h-screen text-light-text dark:text-dark-text transition-colors duration-300">
        {currentUser ? (
          <MainLayout 
            user={currentUser}
            handleLogout={handleLogout}
          />
        ) : authView === 'login' ? (
          <LoginPage 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegistrationPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
