import React, { useState } from 'react';
import { UserRole } from '../types';
import { ICONS } from '../constants';

interface RegistrationPageProps {
  onRegister: (name: string, email: string, role: UserRole, password: string) => void;
  onSwitchToLogin: () => void;
}

const roleOptions: { id: UserRole, name: string, description: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'Worker', name: 'Worker', description: 'Handle daily operational tasks.', icon: ICONS.UserCircle },
    { id: 'Manager', name: 'Manager', description: 'Oversee tasks and inventory.', icon: ICONS.UsersGroup },
    { id: 'Admin', name: 'Admin', description: 'Full system control.', icon: ICONS.Settings }
];

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Worker');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    onRegister(name, email, role, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="w-full max-w-md p-8 space-y-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark">
        <div className="text-center">
            <ICONS.AiLogo className="w-12 h-12 mx-auto text-primary" />
            <h2 className="mt-6 text-3xl font-bold font-heading text-light-text dark:text-dark-text">
                Create a new account
            </h2>
             <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Join WMS AI
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border-b-2 border-border-light dark:border-border-dark bg-transparent placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border-b-2 border-border-light dark:border-border-dark bg-transparent placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border-b-2 border-border-light dark:border-border-dark bg-transparent placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <ICONS.EyeSlash className="w-5 h-5" /> : <ICONS.Eye className="w-5 h-5" />}
              </button>
            </div>
             <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border-b-2 border-border-light dark:border-border-dark bg-transparent placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-primary transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <ICONS.EyeSlash className="w-5 h-5" /> : <ICONS.Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="space-y-3 pt-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Select Your Role</label>
                <div className="grid grid-cols-3 gap-3">
                    {roleOptions.map((option) => (
                        <button
                            type="button"
                            key={option.id}
                            onClick={() => setRole(option.id)}
                            className={`flex flex-col items-center justify-start text-center p-3 rounded-lg border-2 h-32 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-card-light dark:focus:ring-offset-card-dark ${
                                role === option.id
                                    ? 'bg-primary/5 border-primary shadow-sm'
                                    : 'border-border-light dark:border-border-dark hover:border-primary/40'
                            }`}
                        >
                            <option.icon className={`w-7 h-7 mb-2 transition-colors flex-shrink-0 ${role === option.id ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`} />
                            <span className="font-bold font-heading text-sm text-light-text dark:text-dark-text">{option.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">{option.description}</span>
                        </button>
                    ))}
                </div>
            </div>
          
            <div className="pt-2">
                <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-hover transition-colors"
                >
                Register
                </button>
            </div>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;