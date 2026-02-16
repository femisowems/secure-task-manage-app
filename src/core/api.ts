import axios from 'axios';
import { supabase } from './supabase.client';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

let authToken: string | null = null;

// Initial token sync
supabase.auth.getSession().then(({ data: { session } }) => {
    authToken = session?.access_token || null;
});

// Keep token in sync with auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
    authToken = session?.access_token || null;
});

api.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            supabase.auth.signOut();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
