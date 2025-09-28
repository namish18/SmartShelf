
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" defaultValue="Admin User" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input type="email" defaultValue="admin@example.com" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
          </div>
          <div>
            <label className="block text-sm font-medium">Change Password</label>
            <input type="password" placeholder="New Password" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
          </div>
          <div className="pt-4">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
