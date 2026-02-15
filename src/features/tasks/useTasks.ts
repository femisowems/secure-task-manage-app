
import { useState, useCallback, useEffect } from 'react';
import { api } from '../../core/api';
import type { Task } from '../../types';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get<Task[]>('/tasks');
            setTasks(res.data);
            setError('');
        } catch (err) {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const createTask = async (data: Partial<Task>) => {
        await api.post('/tasks', data);
        fetchTasks();
    };

    const updateTask = async (id: string, data: Partial<Task>) => {
        await api.put(`/tasks/${id}`, data);
        fetchTasks();
    };

    const deleteTask = async (id: string) => {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
    };

    return { tasks, loading, error, createTask, updateTask, deleteTask, refresh: fetchTasks };
};
