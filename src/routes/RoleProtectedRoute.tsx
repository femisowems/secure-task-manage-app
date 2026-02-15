
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../core/auth.context';
import type { UserRole } from '../types';

interface RoleProtectedRouteProps {
    allowedRoles: UserRole[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Authentication check...</div>;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard/tasks" replace />;
    }

    return <Outlet />;
};
