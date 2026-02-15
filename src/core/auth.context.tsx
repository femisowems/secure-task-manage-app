
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from './auth.service';
import { UserRole } from '../types';

interface AuthState {
    user: {
        sub: string;
        email: string;
        role: UserRole;
        organizationId: string;
    } | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthState['user']>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getUser();
        if (currentUser && authService.isAuthenticated()) {
            setUser(currentUser);
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        authService.setToken(token);
        const currentUser = authService.getUser();
        setUser(currentUser);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
