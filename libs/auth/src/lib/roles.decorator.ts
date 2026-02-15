
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@secure-task-manage-app/data/enums';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
