import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { User, UserRole } from '../types';
import Modal from '../components/Modal';
import { userService } from '../services/userService';

const AddEditUserForm: React.FC<{ 
  user: User | null; 
  onSave: (userData: any) => void; 
  onCancel: () => void; 
}> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Worker' as UserRole,
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      onSave(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" 
        />
      </div>
      {!user && (
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required={!user}
            minLength={6}
            placeholder="Minimum 6 characters"
            className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" 
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Role</label>
        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Worker">Worker</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { users } = await userService.getAll({ limit: 100 });
      setUsers(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        setUsers(prev => prev.filter(user => user.id !== id));
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleSave = async (userData: any) => {
    try {
      if (editingUser) {
        const updated = await userService.update(editingUser.id, userData);
        setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
      } else {
        const created = await userService.create(userData);
        setUsers(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(error instanceof Error ? error.message : 'Failed to save user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-3xl font-bold font-heading">User Management</h1>
          <button 
            onClick={handleAddNew} 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover font-semibold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ICONS.Plus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-border-light dark:border-border-dark last:border-b-0">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Admin' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
                        : user.role === 'Manager' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2 justify-end">
                    <button 
                      onClick={() => handleEdit(user)} 
                      className="text-slate-500 hover:text-primary p-2 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <ICONS.Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="text-slate-500 hover:text-accent-red p-2 rounded-md hover:bg-accent-red/10 transition-colors"
                    >
                      <ICONS.Delete className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Add New User'}>
          <AddEditUserForm user={editingUser} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      </div>
    </div>
  );
}

export default UserManagementPage;
