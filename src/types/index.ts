
export const UserRole = {
    OWNER: 'Owner',
    ADMIN: 'Admin',
    VIEWER: 'Viewer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    id: string;
    email: string;
    role: UserRole;
    organizationId: string;
}

export interface AuthResponse {
    access_token: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    organizationId: string;
    createdBy: string;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    timestamp: string;
}
