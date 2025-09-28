
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex-grow flex items-center justify-center w-full px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-light-text dark:text-dark-text">
            Inventory Management System
          </h1>
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="font-medium text-primary hover:underline">
              Register
            </button>
          </p>
        </div>
      </main>
      <footer className="w-full text-center p-4 text-gray-500 dark:text-gray-400">
        © 2024 AI Inventory Management
      </footer>
    </div>
  );
};

export default LoginPage;