
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../core/auth.context';
import { UserRole } from '../types';
import { LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const isAdminOrOwner = user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER;

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        clsx(
            'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
            isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
        );

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-indigo-600 leading-tight">Secure Task<br />Management App</h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{user?.role}</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <NavLink to="/dashboard/tasks" className={linkClass}>
                    <LayoutDashboard size={20} />
                    Tasks
                </NavLink>

                {isAdminOrOwner && (
                    <NavLink to="/dashboard/audit" className={linkClass}>
                        <ShieldAlert size={20} />
                        Audit Log
                    </NavLink>
                )}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};
