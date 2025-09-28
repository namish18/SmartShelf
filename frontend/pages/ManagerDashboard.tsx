import React, { useState, useMemo } from 'react';
import { MOCK_TASKS, MOCK_USERS, MOCK_INVENTORY_DATA, ICONS } from '../constants';
import { Task, User } from '../types';
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

const TaskManagement: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const workers = useMemo(() => MOCK_USERS.filter(u => u.role === 'Worker'), []);

    const handleSave = (task: Omit<Task, 'id' | 'status'>) => {
        const newTask: Task = {
            ...task,
            id: Date.now(),
            status: 'Pending',
        };
        setTasks(prev => [newTask, ...prev]);
        setIsModalOpen(false);
    };

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-200 text-yellow-800';
            case 'In Progress': return 'bg-blue-200 text-blue-800';
            case 'Completed': return 'bg-green-200 text-green-800';
        }
    }

    return (
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-heading">Task Management</h3>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-primary/40 hover:bg-primary-hover font-semibold transition">Assign New Task</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border-light dark:border-border-dark">
                            <th className="p-4 font-semibold">Description</th>
                            <th className="p-4 font-semibold">Assigned To</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id} className="border-b border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="p-4">{task.description}</td>
                                <td className="p-4">{workers.find(w => w.id === task.assignedTo)?.name || 'Unassigned'}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>{task.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign New Task">
                <AssignTaskForm workers={workers} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

const AssignTaskForm: React.FC<{ workers: User[]; onSave: (task: Omit<Task, 'id'|'status'>) => void; onCancel: () => void; }> = ({ workers, onSave, onCancel }) => {
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState<number>(workers[0]?.id || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ description, assignedTo: Number(assignedTo) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Task Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Assign To Worker</label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(Number(e.target.value))} className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-1 focus:ring-primary">
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition">Assign Task</button>
            </div>
        </form>
    );
};


const ManagerDashboard: React.FC = () => {
    const metrics = useMemo(() => {
        const pendingTasks = MOCK_TASKS.filter(t => t.status === 'Pending').length;
        const totalItems = MOCK_INVENTORY_DATA.reduce((sum, item) => sum + item.quantity, 0);
        const workersOnline = MOCK_USERS.filter(u => u.role === 'Worker').length;
        return { pendingTasks, totalItems, workersOnline };
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard title="Pending Tasks" value={metrics.pendingTasks.toString()} icon={ICONS.Tasks} />
                <SummaryCard title="Total Inventory Items" value={metrics.totalItems.toLocaleString()} icon={ICONS.ArchiveBox} />
                <SummaryCard title="Active Workers" value={metrics.workersOnline.toString()} icon={ICONS.UsersGroup} />
            </div>
            <TaskManagement />
        </div>
    );
};

export default ManagerDashboard;