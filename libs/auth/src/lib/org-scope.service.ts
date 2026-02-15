
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Organization } from '@secure-task-manage-app/data/interfaces';
import { UserRole } from '@secure-task-manage-app/data/enums';
// Assuming OrganizationEntity is defined somewhere, but for now we'll mock the repo usage or define a placeholder
// Since we don't have the full entity definition, I'll use `any` for the repo generic for now to avoid compilation errors in this snippet, 
// but in a real app it would be OrganizationEntity.
// A better approach is to assume the entity exists in libs/data or similar. 
// For this exercise, I will assume an OrganizationEntity interface/class exists or I will just use the interface with the repository if TypeORM allows (it usually requires a class).
// Let's declare a minimal class for local usage to satisfy TypeORM injection if needed, or just standard Repository<Organization>.

@Injectable()
export class OrgScopeService {
    constructor(
        @InjectRepository('Organization')
        private readonly orgRepo: Repository<Organization>
    ) { }

    async getAccessibleOrganizationIds(user: User): Promise<string[]> {
        const userOrgId = user.organizationId;

        // viewer always scoped to their own org
        if (user.role === UserRole.VIEWER) {
            return [userOrgId];
        }

        // Owner/Admin of a PARENT org gets access to parent + all children
        // We need to check if the user's org IS a parent (has children).
        // Or if the logic implies that IF they are owner/admin, they get their org AND any children.

        // Fetch user's organization to check if it's a parent or child? 
        // The requirement says: "If user is Owner/Admin of a PARENT org -> return [parentOrgId, all childOrgIds]"
        // "If user belongs to CHILD org -> return [childOrgId]"

        // We can just fetch all orgs where parentOrganizationId = userOrgId.
        const childOrgs = await this.orgRepo.find({
            where: { parentOrganizationId: userOrgId },
        });

        const childOrgIds = childOrgs.map(org => org.id);

        // If no children found, it might be a child org itself or just a standalone parent. 
        // In either case, [userOrgId, ...childOrgIds] covers it.
        // If it's a child org, childOrgIds will be empty (assuming max 1 level of depth or we only care about direct children).
        // If we need recursive children, we'd need a recursive query, but let's stick to direct children for now based on "parent/child" phrasing.

        return [userOrgId, ...childOrgIds];
    }
}
