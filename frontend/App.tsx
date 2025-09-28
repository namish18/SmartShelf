import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import MainLayout from './pages/MainLayout';
import { UserRole, User } from './types';
import { MOCK_USERS } from './constants';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; role: UserRole } | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

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

  const handleLogin = (email: string, password: string) => {
    // In a real app, you'd validate the password against a hash.
    // Here we just find the user by email.
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser({ name: user.name, role: user.role });
    } else {
      alert('Invalid email or password.');
    }
  };
  
  const handleRegister = (name: string, email: string, role: UserRole, password: string) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('A user with this email already exists.');
        return;
    }
    
    // In a real app, you would hash the password before saving.
    const newUser: User = {
        id: Date.now(),
        name,
        email,
        role,
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    // Automatically log in the new user
    setCurrentUser({ name: newUser.name, role: newUser.role });
    setAuthView('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('login');
  };

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