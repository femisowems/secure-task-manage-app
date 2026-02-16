import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../core/supabase.client';

type AuthMode = 'login' | 'signup' | 'reset';

export const LoginPage: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [role, setRole] = useState<'Owner' | 'Viewer'>('Owner');

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError('');
        setSuccessMessage('');
        setPassword('');
        setConfirmPassword('');
        setRole('Owner');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (mode === 'login') {
                console.log('LoginPage: Attempting login for', email);
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                console.log('LoginPage: Login result', { data, error: signInError });
                if (signInError) throw signInError;
                navigate('/dashboard/tasks');
            } else if (mode === 'signup') {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: role,
                        },
                    },
                });
                if (signUpError) throw signUpError;
                setSuccessMessage('Account created! Please check your email or log in.');
                setMode('login');
                setPassword('');
                setConfirmPassword('');
            } else if (mode === 'reset') {
                const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
                if (resetError) throw resetError;
                setSuccessMessage('Password reset link sent.');
            }
        } catch (err: any) {
            setError(err.message || 'Action failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
            {import.meta.env.DEV && (
                <div className="absolute top-4 right-4 bg-yellow-50 p-4 rounded-md shadow-md border border-yellow-200 text-sm max-w-xs">
                    <h3 className="font-bold text-yellow-800 mb-2">Dev Credentials</h3>
                    <div className="space-y-2">
                        <div>
                            <span className="font-semibold block text-yellow-700">Admin (Owner):</span>
                            <code className="bg-yellow-100 px-1 rounded">admin@test.com</code> / <code className="bg-yellow-100 px-1 rounded">password123</code>
                        </div>
                        <div>
                            <span className="font-semibold block text-yellow-700">User (Viewer):</span>
                            <code className="bg-yellow-100 px-1 rounded">user@test.com</code> / <code className="bg-yellow-100 px-1 rounded">password123</code>
                        </div>
                    </div>
                </div>
            )}

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
                        <>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as 'Owner' | 'Viewer')}
                                >
                                    <option value="Owner">Owner (Full Access)</option>
                                    <option value="Viewer">Viewer (Read Only)</option>
                                </select>
                            </div>
                        </>
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
