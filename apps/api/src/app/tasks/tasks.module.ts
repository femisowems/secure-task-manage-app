
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task, Organization, User } from '@secure-task-manage-app/data/entities';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from '../auth/auth.module'; // for guards/auth services if exported
import { AuditModule } from '../audit/audit.module';
import { RbacService } from '@secure-task-manage-app/auth/rbac.service';
import { OrgScopeService } from '@secure-task-manage-app/auth/org-scope.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, Organization, User]),
        AuditModule,
        AuthModule
    ],
    providers: [TasksService, RbacService, OrgScopeService], // Provide usage services locally or import via module
    controllers: [TasksController],
})
export class TasksModule { }
