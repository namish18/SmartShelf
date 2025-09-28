import React, { useState } from 'react';
import { ICONS } from '../constants';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-light-bg dark:bg-dark-bg">
      <div className="w-full max-w-5xl bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-primary text-white">
          <ICONS.AiLogo className="w-24 h-24 mb-4"/>
          <h1 className="text-4xl font-extrabold font-heading text-center">AI-Powered WMS</h1>
          <p className="text-center mt-2 text-indigo-200">Intelligent Warehouse Management</p>
        </div>
        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold font-heading text-light-text dark:text-dark-text mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to continue to your dashboard.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-2 font-semibold" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 border rounded-lg bg-slate-50 dark:bg-slate-700 border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-2 font-semibold" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-3 border rounded-lg bg-slate-50 dark:bg-slate-700 border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-300 shadow-lg hover:shadow-primary/40"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="font-medium text-primary hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;