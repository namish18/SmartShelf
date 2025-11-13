import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { Task, User } from '../types';
import Modal from '../components/Modal';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';

const AddEditTaskForm: React.FC<{
  task: Task | null;
  workers: User[];
  onSave: (taskData: any) => void;
  onCancel: () => void;
}> = ({ task, workers, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: task?.description || '',
    assignedTo: task?.assignedTo || '',
    status: task?.status || 'Pending',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
          Task Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
          Assign To
        </label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Worker</option>
          {workers.map(worker => (
            <option key={worker.id} value={worker.id}>
              {worker.name} ({worker.email})
            </option>
          ))}
        </select>
      </div>
      {task && (
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}
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

const TaskManagementPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchWorkers()]).finally(() => setLoading(false));
  }, []);

  const fetchTasks = async () => {
    try {
      const { tasks } = await taskService.getAll({ limit: 100 });
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      alert('Failed to load tasks');
    }
  };

  const fetchWorkers = async () => {
    try {
      const workers = await userService.getWorkers();
      setWorkers(workers);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    }
  };

  // Update the getWorkerName function:
const getWorkerName = (workerId: string) => {
  const worker = workers.find(w => w.id === workerId);
  return worker ? worker.name : 'Unknown';
};


  const handleAddNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        setTasks(prev => prev.filter(task => task.id !== id));
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleSave = async (taskData: any) => {
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.id, taskData);
        setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } else {
        const created = await taskService.create({
          description: taskData.description,
          assignedTo: parseInt(taskData.assignedTo),
        });
        setTasks(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to save task:', error);
      alert(error instanceof Error ? error.message : 'Failed to save task');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Pending':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
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
          <h1 className="text-3xl font-bold font-heading">Task Management</h1>
          <button
            onClick={handleAddNew}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover font-semibold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ICONS.Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned To</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="border-b border-border-light dark:border-border-dark last:border-b-0">
                  <td className="p-4 font-medium max-w-md truncate">{task.description}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{getWorkerName(task.assignedTo)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2 justify-end">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-slate-500 hover:text-primary p-2 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <ICONS.Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-slate-500 hover:text-accent-red p-2 rounded-md hover:bg-accent-red/10 transition-colors"
                    >
                      <ICONS.Delete className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTask ? 'Edit Task' : 'Add New Task'}
        >
          <AddEditTaskForm
            task={editingTask}
            workers={workers}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default TaskManagementPage;
