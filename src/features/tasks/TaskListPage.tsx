
import React, { useState } from 'react';
import { useTasks } from './useTasks';
import { TaskForm } from './TaskForm';
import { useAuth } from '../../core/auth.context';
import { UserRole } from '../../types';
import type { Task } from '../../types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export const TaskListPage: React.FC = () => {
    const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const canEdit = user?.role !== UserRole.VIEWER;

    const handleCreate = (data: Partial<Task>) => {
        createTask(data);
        setIsModalOpen(false);
    };

    const handleUpdate = (data: Partial<Task>) => {
        if (editingTask) {
            updateTask(editingTask.id, data);
            setEditingTask(null);
            setIsModalOpen(false);
        }
    };

    const openCreate = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEdit = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    New Task
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200 text-gray-500">
                    No tasks found. Create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                                    {task.category}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

                            {canEdit && (
                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => openEdit(task)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'New Task'}</h2>
                        <TaskForm
                            initialData={editingTask || undefined}
                            onSubmit={editingTask ? handleUpdate : handleCreate}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
