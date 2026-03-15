import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client.js";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg"

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 100,
    idleTimeoutMillis: 30000
})
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const connectPrisma = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma Connected");
    }
     catch (err : any) {
        console.log(err);
     }
}

export { prisma, connectPrisma }