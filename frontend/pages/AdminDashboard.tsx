import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_INVENTORY_DATA, ICONS } from '../constants';
import { User, UserRole } from '../types';
import Modal from '../components/Modal';
import SummaryCard from '../components/SummaryCard';

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
        <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h3 className="text-xl font-bold font-heading">User Management</h3>
                <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover font-semibold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
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
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : user.role === 'Manager' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>{user.role}</span></td>
                                <td className="p-4 flex space-x-2 justify-end">
                                    <button onClick={() => handleEdit(user)} className="text-slate-500 hover:text-primary p-2 rounded-md hover:bg-primary/10 transition-colors"><ICONS.Edit className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(user.id)} className="text-slate-500 hover:text-accent-red p-2 rounded-md hover:bg-accent-red/10 transition-colors"><ICONS.Delete className="w-5 h-5" /></button>
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
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="Manager">Manager</option>
                    <option value="Worker">Worker</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition-colors">Save</button>
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
        <SummaryCard title="Total Users" value={metrics.totalUsers.toString()} icon={ICONS.UsersGroup} color="blue" />
        <SummaryCard title="Total Inventory Items" value={metrics.totalItems.toLocaleString()} icon={ICONS.ArchiveBox} color="green" />
        <SummaryCard title="Total Stock Value" value={`$${metrics.stockValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={ICONS.CurrencyDollar} color="yellow" />
      </div>
      <UserManagementTable />
    </div>
  );
};

export default AdminDashboard;