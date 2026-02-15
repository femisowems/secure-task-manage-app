
import axios from 'axios';
import { authService } from './auth.service';

export const api = axios.create({
    baseURL: '/api', // Vite proxy handles this? Or separate host. Assuming standard /api proxy.
});

api.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
