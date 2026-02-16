
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
        <div className="max-w-8xl mx-auto space-y-grid-xl">
            <div className="flex justify-between items-center">
                <h1 className="text-h1 font-bold text-text-primary">Tasks</h1>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-grid-sm px-grid-md py-grid-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    New Task
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-text-secondary">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 bg-surface-glass backdrop-blur-md rounded-card border border-border-subtle text-text-secondary">
                    No tasks found. Create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-lg">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-surface-glass backdrop-blur-md p-grid-lg rounded-card border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-grid-md">
                                <span className="px-grid-sm py-1 text-caption font-bold uppercase bg-blue-50 text-blue-700 rounded-pill">
                                    {task.category}
                                </span>
                                <span className={`px-grid-sm py-1 text-caption font-bold uppercase rounded-pill ${task.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>

                            <h3 className="text-h4 font-semibold text-text-primary mb-grid-sm leading-tight">{task.title}</h3>
                            <p className="text-text-secondary text-body-sm mb-grid-md line-clamp-2">{task.description}</p>

                            {canEdit && (
                                <div className="flex justify-end gap-grid-sm mt-grid-md pt-grid-md border-t border-border-subtle">
                                    <button
                                        onClick={() => openEdit(task)}
                                        className="p-grid-sm text-text-secondary hover:text-indigo-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="p-grid-sm text-text-secondary hover:text-red-600 transition-colors"
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-grid-md z-50">
                    <div className="bg-surface rounded-modal w-full max-w-md p-grid-xl relative shadow-2xl border border-border-subtle">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-grid-md right-grid-md text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-h3 font-bold mb-grid-lg text-text-primary">{editingTask ? 'Edit Task' : 'New Task'}</h2>
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
