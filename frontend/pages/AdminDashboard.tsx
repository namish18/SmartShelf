import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_INVENTORY_DATA, ICONS } from '../constants';
import { User, UserRole } from '../types';
import Modal from '../components/Modal';

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ComponentType<{className?: string}>; }> = ({ title, value, icon: Icon }) => (
  <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg flex items-center">
    <div className="p-3 bg-primary/10 rounded-lg mr-4">
        <Icon className="w-8 h-8 text-primary" />
    </div>
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-1 font-heading">{value}</p>
    </div>
  </div>
);

const UserManagementTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleAddNew = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(user => user.id !== id));
        }
    };

    const handleSave = (user: User) => {
        if (editingUser) {
            setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
        } else {
            setUsers(prev => [{ ...user, id: Date.now() }, ...prev]);
        }
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-heading">User Management</h3>
                <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-primary/40 hover:bg-primary-hover font-semibold transition">Add New User</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border-light dark:border-border-dark">
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="p-4 font-medium">{user.name}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-red-200 text-red-800' : user.role === 'Manager' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>{user.role}</span></td>
                                <td className="p-4 flex space-x-2">
                                    <button onClick={() => handleEdit(user)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-500/10"><ICONS.Edit className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(user.id)} className="text-accent-red hover:text-red-700 p-1 rounded-full hover:bg-red-500/10"><ICONS.Delete className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Add New User'}>
                <AddEditUserForm user={editingUser} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
}

const AddEditUserForm: React.FC<{ user: User | null; onSave: (user: User) => void; onCancel: () => void; }> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Worker' as UserRole,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: user?.id || 0 });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary">
                    <option value="Manager">Manager</option>
                    <option value="Worker">Worker</option>
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition">Save</button>
            </div>
        </form>
    );
};


const AdminDashboard: React.FC = () => {
    const metrics = useMemo(() => {
        const totalUsers = MOCK_USERS.length;
        const totalItems = MOCK_INVENTORY_DATA.reduce((sum, item) => sum + item.quantity, 0);
        const stockValue = MOCK_INVENTORY_DATA.reduce((sum, item) => sum + item.quantity * 3.5, 0);
        return { totalUsers, totalItems, stockValue };
    }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Total Users" value={metrics.totalUsers.toString()} icon={ICONS.UsersGroup} />
        <SummaryCard title="Total Inventory Items" value={metrics.totalItems.toLocaleString()} icon={ICONS.ArchiveBox} />
        <SummaryCard title="Total Stock Value" value={`$${metrics.stockValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={ICONS.CurrencyDollar} />
      </div>
      <UserManagementTable />
    </div>
  );
};

export default AdminDashboard;