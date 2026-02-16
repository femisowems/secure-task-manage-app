
import React, { useState } from 'react';
import type { Task } from '../../types';

interface TaskFormProps {
    initialData?: Task;
    onSubmit: (data: Partial<Task>) => void;
    onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [category, setCategory] = useState(initialData?.category || 'Work');
    const [status, setStatus] = useState(initialData?.status || 'Pending');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, category, status });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-grid-md">
            <div>
                <label className="block text-body-sm font-semibold text-text-primary mb-1">Title</label>
                <input
                    type="text"
                    required
                    className="block w-full px-grid-md py-grid-sm bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body text-text-primary"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-body-sm font-semibold text-text-primary mb-1">Description</label>
                <textarea
                    className="block w-full px-grid-md py-grid-sm bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body text-text-primary"
                    rows={3}
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option>Work</option>
                        <option>Personal</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-grid-md pt-grid-lg border-t border-border-subtle">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-grid-md py-grid-sm text-body-sm font-medium text-text-secondary hover:bg-gray-50 border border-border-subtle rounded-md transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-grid-md py-grid-sm text-body-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
                >
                    {initialData ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};
