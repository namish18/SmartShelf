import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_INVENTORY_DATA, ICONS } from '../constants';
import { User, UserRole } from '../types';
import Modal from '../components/Modal';

const SummaryCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col">
    <h3 className="text-gray-500 dark:text-gray-400 font-semibold">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">User Management</h3>
                <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">Add New User</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-red-200 text-red-800' : user.role === 'Manager' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>{user.role}</span></td>
                                <td className="p-3 flex space-x-2">
                                    <button onClick={() => handleEdit(user)} className="text-blue-500 hover:text-blue-700"><ICONS.Edit className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700"><ICONS.Delete className="w-5 h-5" /></button>
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
                <label className="block text-sm font-medium">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
            </div>
            <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0" />
            </div>
            <div>
                <label className="block text-sm font-medium">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:bg-white focus:ring-0">
                    <option value="Manager">Manager</option>
                    <option value="Worker">Worker</option>
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600">Save</button>
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
        <SummaryCard title="Total Users" value={metrics.totalUsers.toString()} />
        <SummaryCard title="Total Inventory Items" value={metrics.totalItems.toLocaleString()} />
        <SummaryCard title="Total Stock Value" value={`$${metrics.stockValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
      </div>
      <UserManagementTable />
    </div>
  );
};

export default AdminDashboard;