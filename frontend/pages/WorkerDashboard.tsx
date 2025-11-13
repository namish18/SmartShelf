import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { Task } from '../types';
import { taskService } from '../services/taskService';

const WorkerDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const { tasks } = await taskService.getMyTasks({ limit: 100 });
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      alert('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const updated = await taskService.updateStatus(taskId, newStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Failed to update task status');
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

  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <h3 className="text-3xl font-bold mt-1">{pendingCount}</h3>
            </div>
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
              <ICONS.Tasks className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
              <h3 className="text-3xl font-bold mt-1">{inProgressCount}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <ICONS.Tasks className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
              <h3 className="text-3xl font-bold mt-1">{completedCount}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <ICONS.Tasks className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold font-heading">My Tasks</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'Pending'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('In Progress')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === 'In Progress'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              In Progress
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium text-lg">{task.description}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'In Progress')}
                      className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 font-semibold transition-colors"
                    >
                      Start
                    </button>
                  )}
                  {task.status === 'In Progress' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'Completed')}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-semibold transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No tasks found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
