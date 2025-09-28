import React, { useState, useMemo } from 'react';
import { MOCK_TASKS, MOCK_USERS } from '../constants';
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

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'In Progress': return 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'Completed': return 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Assigned Tasks</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="space-y-4">
                    {myTasks.length > 0 ? myTasks.map(task => (
                        <div key={task.id} className="p-4 border dark:border-gray-700 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="font-semibold">{task.description}</p>
                                <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </div>
                            {task.status !== 'Completed' && (
                                <div className="flex space-x-2 flex-shrink-0">
                                    {task.status === 'Pending' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(task.id, 'In Progress')}
                                            className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
                                        >
                                            Start Task
                                        </button>
                                    )}
                                    {task.status === 'In Progress' && (
                                         <button 
                                            onClick={() => handleStatusUpdate(task.id, 'Completed')}
                                            className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors text-sm"
                                        >
                                            Mark as Completed
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">You have no assigned tasks.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;