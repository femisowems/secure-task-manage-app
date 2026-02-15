
import { DataSource } from 'typeorm';
import { User, Organization } from './libs/data/src/lib/entities';
import { UserRole } from './libs/data/src/lib/enums';
import * as bcrypt from 'bcrypt';

async function seed() {
    const dataSource = new DataSource({
        type: 'sqlite',
        database: 'database.sqlite',
        entities: [User, Organization],
        synchronize: true,
    });

    await dataSource.initialize();

    const orgRepo = dataSource.getRepository(Organization);
    const userRepo = dataSource.getRepository(User);

    // 1. Create Default Organization
    let defaultOrg = await orgRepo.findOne({ where: { name: 'Default Organization' } });
    if (!defaultOrg) {
        defaultOrg = orgRepo.create({
            name: 'Default Organization'
        });
        await orgRepo.save(defaultOrg);
        console.log('Created Default Organization');
    }

    // 2. Create Admin User
    const adminEmail = 'admin@test.com';
    let admin = await userRepo.findOne({ where: { email: adminEmail } });
    if (!admin) {
        const passwordHash = await bcrypt.hash('password123', 10);
        admin = userRepo.create({
            email: adminEmail,
            passwordHash: passwordHash,
            role: UserRole.OWNER,
            organizationId: defaultOrg.id
        });
        await userRepo.save(admin);
        console.log('Created Admin User: admin@test.com / password123');
    }

    // 3. Create Default User
    const userEmail = 'user@test.com';
    let standardUser = await userRepo.findOne({ where: { email: userEmail } });
    if (!standardUser) {
        const passwordHash = await bcrypt.hash('password123', 10);
        standardUser = userRepo.create({
            email: userEmail,
            passwordHash: passwordHash,
            role: UserRole.VIEWER,
            organizationId: defaultOrg.id
        });
        await userRepo.save(standardUser);
        console.log('Created Standard User: user@test.com / password123');
    }

    await dataSource.destroy();
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
