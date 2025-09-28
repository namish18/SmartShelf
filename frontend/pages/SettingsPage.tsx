import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-heading mb-6">Settings</h1>
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold font-heading mb-6 pb-4 border-b border-border-light dark:border-border-dark">User Profile</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</label>
            <input type="text" defaultValue="Admin User" className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</label>
            <input type="email" defaultValue="admin@example.com" className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Change Password</label>
            <input type="password" placeholder="New Password" className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
          </div>
          <div className="pt-4">
            <button type="submit" className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition shadow-lg hover:shadow-primary/40">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;