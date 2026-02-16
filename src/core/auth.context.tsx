import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from './supabase.client';
import api from './api';
import { UserRole } from '../types';

interface AuthState {
    user: {
        id: string;
        email: string;
        role: UserRole;
        organizationId: string;
    } | null;
    isAuthenticated: boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthState['user']>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            console.log('AuthContext: Fetching profile...');
            const { data } = await api.get('/auth/me');
            console.log('AuthContext: Profile fetched', data);
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Handle initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchProfile();
            } else {
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('AuthContext: Auth state change', event, session);
            if (session) {
                await fetchProfile();
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        }
    }, [user]);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout, isLoading }}>
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
