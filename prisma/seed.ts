import { PrismaClient } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';
import pg from "pg";
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../src/config/index.js';

const pool = new pg.Pool({
    connectionString: config.databaseUrl,
    max: 100,
    idleTimeoutMillis: 30000
})
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });


async function main() {
    const adminEmail = config.adminEmail || 'admin@techreels.com';
    const adminPassword = config.adminPassword || 'secure_password_123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.users.upsert({
        where: { email: adminEmail },
        update: {}, // Do nothing if admin already exists
        create: {
            email: adminEmail,
            username: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN', // Ensure this matches your Enum in schema.prisma
            verified: true,
            authProvider: "default"
        },
    });

    console.log({ seededAdmin: admin.email });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
