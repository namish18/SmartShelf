import React, { useState, useMemo } from 'react';
import { MOCK_TASKS, MOCK_USERS, ICONS } from '../constants';
import { Task, User } from '../types';
import Modal from '../components/Modal';

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
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Task Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Assign To Worker</label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition-colors">Assign Task</button>
            </div>
        </form>
    );
};


const TaskManagementPage: React.FC = () => {
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
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        }
    }

    return (
        <div className="space-y-6">
             <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h1 className="text-3xl font-bold font-heading">Task Management</h1>
                    <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover font-semibold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                    <ICONS.Plus className="w-5 h-5" />
                    <span>New Task</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark">
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned To</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="border-b border-border-light dark:border-border-dark last:border-b-0">
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
        </div>
    );
};

export default TaskManagementPage;