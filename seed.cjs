
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function seed() {
    const db = new sqlite3.Database('database.sqlite');

    const run = (sql, params = []) => new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });

    const get = (sql, params = []) => new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });

    try {
        console.log('Connecting to database and creating tables if needed...');

        // Create Tables
        await run(`
            CREATE TABLE IF NOT EXISTS organizations (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                parentOrganizationId TEXT
            )
        `);

        await run(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                passwordHash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'Viewer',
                organizationId TEXT NOT NULL,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (organizationId) REFERENCES organizations (id)
            )
        `);

        // 1. Ensure Organization exists
        let org = await get("SELECT * FROM organizations WHERE name = ?", ['Default Organization']);
        let orgId;
        if (!org) {
            orgId = crypto.randomUUID();
            await run("INSERT INTO organizations (id, name) VALUES (?, ?)", [orgId, 'Default Organization']);
            console.log('Created Default Organization');
        } else {
            orgId = org.id;
        }

        const passwordHash = await bcrypt.hash('password123', 10);

        // 2. Create Admin
        let admin = await get("SELECT * FROM users WHERE email = ?", ['admin@test.com']);
        if (!admin) {
            await run(
                "INSERT INTO users (id, email, passwordHash, role, organizationId, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
                [crypto.randomUUID(), 'admin@test.com', passwordHash, 'Owner', orgId, new Date().toISOString()]
            );
            console.log('Created Admin: admin@test.com / password123');
        }

        // 3. Create User
        let user = await get("SELECT * FROM users WHERE email = ?", ['user@test.com']);
        if (!user) {
            await run(
                "INSERT INTO users (id, email, passwordHash, role, organizationId, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
                [crypto.randomUUID(), 'user@test.com', passwordHash, 'Viewer', orgId, new Date().toISOString()]
            );
            console.log('Created User: user@test.com / password123');
        }

        console.log('\nSeeding complete! You can now log in with:');
        console.log('Admin: admin@test.com / password123');
        console.log('User:  user@test.com / password123');
    } catch (err) {
        console.error('Error seeding:', err);
    } finally {
        db.close();
    }
}

seed();
