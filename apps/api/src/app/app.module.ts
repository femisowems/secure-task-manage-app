
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { AuditModule } from './audit/audit.module';
import { User, Organization, Task, AuditLog } from '@secure-task-manage-app/data/entities';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite', // Default to sqlite for ease
            database: process.env.DATABASE_URL || 'database.sqlite',
            entities: [User, Organization, Task, AuditLog],
            synchronize: true, // Only for dev!
            logging: true,
        }),
        AuthModule,
        TasksModule,
        AuditModule,
    ],
})
export class AppModule { }
