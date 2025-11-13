import React, { useState, useMemo } from 'react';
import { MOCK_TASKS } from '../constants';
import { Task } from '../types';

const WorkerDashboard: React.FC = () => {
    // In a real app, you'd get the current worker's ID from the logged-in user context.
    // Here we'll simulate as worker with ID 3.
    const currentWorkerId = 3; 

    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

    const myTasks = useMemo(() => {
        return tasks.filter(task => task.assignedTo === currentWorkerId);
    }, [tasks, currentWorkerId]);

    const handleStatusUpdate = (taskId: number, newStatus: Task['status']) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    const getStatusClasses = (status: Task['status']) => {
        switch (status) {
            case 'Pending': return { border: 'border-accent-yellow', dot: 'bg-accent-yellow', text: 'text-yellow-700 dark:text-accent-yellow' };
            case 'In Progress': return { border: 'border-accent-blue', dot: 'bg-accent-blue', text: 'text-blue-700 dark:text-accent-blue' };
            case 'Completed': return { border: 'border-accent-green', dot: 'bg-accent-green', text: 'text-green-700 dark:text-accent-green' };
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-heading mb-6">My Assigned Tasks</h1>
            <div className="space-y-4">
                {myTasks.length > 0 ? myTasks.map(task => {
                    const statusClasses = getStatusClasses(task.status);
                    return (
                        <div key={task.id} className={`bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md border border-border-light dark:border-border-dark border-l-4 ${statusClasses.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-shadow hover:shadow-lg`}>
                            <div className="flex-grow">
                                <p className="font-medium text-light-text dark:text-dark-text">{task.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${statusClasses.dot}`}></div>
                                    <span className={`text-sm font-semibold ${statusClasses.text}`}>{task.status}</span>
                                </div>
                            </div>
                            
                            {/* Replaced buttons with a dropdown */}
                            <div className="flex-shrink-0">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusUpdate(task.id, e.target.value as Task['status'])}
                                    className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 border-2 ${statusClasses.border} ${statusClasses.text} focus:outline-none focus:ring-2 focus:ring-primary transition-colors appearance-none cursor-pointer`}
                                >
                                    <option value="Pending">To be Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Done</option>
                                </select>
                            </div>

                        </div>
                    );
                }) : (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-16 bg-card-light dark:bg-card-dark rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark">
                        <p className="font-semibold text-lg">No tasks assigned</p>
                        <p>You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerDashboard;