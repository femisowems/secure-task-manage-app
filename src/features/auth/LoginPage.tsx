
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../core/auth.service';
import type { AuthResponse } from '../../types';
import { useAuth } from '../../core/auth.context';
import { api } from '../../core/api';

type AuthMode = 'login' | 'signup' | 'reset';

export const LoginPage: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError('');
        setSuccessMessage('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (mode === 'login') {
                const res = await api.post<AuthResponse>('/auth/login', { email, password });
                login(res.data.access_token);
                navigate('/dashboard/tasks');
            } else if (mode === 'signup') {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                await authService.signup(email, password);
                setSuccessMessage('Account created. Please log in.');
                setMode('login');
                setPassword('');
                setConfirmPassword('');
            } else if (mode === 'reset') {
                await authService.resetPassword(email);
                setSuccessMessage('Password reset link sent.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Action failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex justify-center space-x-4 mb-8">
                    {(['login', 'signup', 'reset'] as AuthMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === m ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {m.charAt(0).toUpperCase() + m.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {mode !== 'reset' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {mode === 'login' ? (
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button onClick={() => switchMode('signup')} className="text-indigo-600 hover:underline">
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <button onClick={() => switchMode('login')} className="text-sm text-indigo-600 hover:underline">
                            Back to Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
