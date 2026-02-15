
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardLayout } from '../layout/DashboardLayout';
import { TaskListPage } from '../features/tasks/TaskListPage';
import { AuditLogPage } from '../features/audit/AuditLogPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { UserRole } from '../types';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="tasks" replace />} />
                    <Route path="tasks" element={<TaskListPage />} />

                    <Route element={<RoleProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.ADMIN]} />}>
                        <Route path="audit" element={<AuditLogPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};
