
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole, ActionType } from './enums';

// --------------------------------------------------
// ORGANIZATION ENTITY
// --------------------------------------------------
@Entity('organizations')
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    parentOrganizationId: string;

    @ManyToOne(() => Organization, (org) => org.childOrganizations, { nullable: true })
    @JoinColumn({ name: 'parentOrganizationId' })
    parentOrganization: Organization;

    @OneToMany(() => Organization, (org) => org.parentOrganization)
    childOrganizations: Organization[];

    @OneToMany(() => User, (user) => user.organization)
    users: User[];

    @OneToMany(() => Task, (task) => task.organization)
    tasks: Task[];
}

// --------------------------------------------------
// USER ENTITY
// --------------------------------------------------
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.VIEWER
    })
    role: UserRole;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, (org) => org.users)
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;

    @CreateDateColumn()
    createdAt: Date;
}

// --------------------------------------------------
// TASK ENTITY
// --------------------------------------------------
@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    status: string;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, (org) => org.tasks)
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;

    @Column()
    createdBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdBy' })
    creator: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

// --------------------------------------------------
// AUDIT LOG ENTITY
// --------------------------------------------------
@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({
        type: 'simple-enum',
        enum: ActionType
    })
    action: ActionType;

    @Column()
    resourceType: string;

    @Column({ nullable: true })
    resourceId: string;

    @CreateDateColumn()
    timestamp: Date;
}
