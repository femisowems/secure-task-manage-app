
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../types';
import { api } from './api';

interface DecodedToken {
    sub: string;
    email: string;
    role: UserRole;
    organizationId: string;
    exp: number;
}

const TOKEN_KEY = 'auth_token';

export const authService = {
    setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
    },

    getUser(): DecodedToken | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            return jwtDecode<DecodedToken>(token);
        } catch {
            return null;
        }
    },

    isAuthenticated(): boolean {
        const user = this.getUser();
        if (!user) return false;
        return user.exp * 1000 > Date.now();
    },

    async signup(email: string, pass: string) {
        return api.post('/auth/signup', { email, password: pass });
    },

    async resetPassword(email: string) {
        return api.post('/auth/reset-password', { email });
    }
};
