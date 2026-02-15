
import { Injectable } from '@nestjs/common';
import { User, Task } from '@secure-task-manage-app/data/interfaces';
import { UserRole } from '@secure-task-manage-app/data/enums';
import { OrgScopeService } from './org-scope.service';

@Injectable()
export class RbacService {
    constructor(private readonly orgScopeService: OrgScopeService) { }

    /**
     * Helper to check if user has ONE OF the required roles,
     * respecting hierarchy: Owner > Admin > Viewer
     */
    hasRequiredRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
        if (requiredRoles.includes(userRole)) {
            return true;
        }

        // Heirarchy check
        // If Owner, they have Admin and Viewer rights too (if listed in requiredRoles)
        if (userRole === UserRole.OWNER) {
            if (requiredRoles.includes(UserRole.ADMIN) || requiredRoles.includes(UserRole.VIEWER)) {
                return true;
            }
        }

        // If Admin, they have Viewer rights
        if (userRole === UserRole.ADMIN) {
            if (requiredRoles.includes(UserRole.VIEWER)) {
                return true;
            }
        }

        return false;
    }

    canCreateTask(user: User): boolean {
        // Owner/Admin -> true
        if (this.hasRequiredRole(user.role, [UserRole.OWNER, UserRole.ADMIN])) {
            return true;
        }
        // Viewer -> true (only in their org, implied by creation logic usually being scoped to current org)
        if (user.role === UserRole.VIEWER) {
            return true;
        }
        return false;
    }

    async canReadTask(user: User, task: Task): Promise<boolean> {
        const accessibleOrgIds = await this.orgScopeService.getAccessibleOrganizationIds(user);
        const inScope = accessibleOrgIds.includes(task.organizationId);

        if (!inScope) {
            return false;
        }

        // Owner/Admin -> if in org scope (already checked)
        if (this.hasRequiredRole(user.role, [UserRole.OWNER, UserRole.ADMIN])) {
            return true;
        }

        // Viewer -> only if createdBy === user.id
        if (user.role === UserRole.VIEWER) {
            return task.createdBy === user.id;
        }

        return false;
    }

    async canUpdateTask(user: User, task: Task): Promise<boolean> {
        const accessibleOrgIds = await this.orgScopeService.getAccessibleOrganizationIds(user);
        const inScope = accessibleOrgIds.includes(task.organizationId);

        if (!inScope) {
            return false;
        }

        if (this.hasRequiredRole(user.role, [UserRole.OWNER, UserRole.ADMIN])) {
            return true;
        }

        if (user.role === UserRole.VIEWER) {
            return task.createdBy === user.id;
        }

        return false;
    }

    async canDeleteTask(user: User, task: Task): Promise<boolean> {
        const accessibleOrgIds = await this.orgScopeService.getAccessibleOrganizationIds(user);
        const inScope = accessibleOrgIds.includes(task.organizationId);

        if (!inScope) {
            return false;
        }

        // Owner/Admin -> true
        if (this.hasRequiredRole(user.role, [UserRole.OWNER, UserRole.ADMIN])) {
            return true;
        }

        // Viewer -> false
        return false;
    }

    canViewAuditLog(user: User): boolean {
        return this.hasRequiredRole(user.role, [UserRole.OWNER, UserRole.ADMIN]);
    }
}
