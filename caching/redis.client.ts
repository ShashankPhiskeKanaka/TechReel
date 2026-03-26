import { createClient } from "redis";
import { serverError } from "../utils/error.utils.js";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";
import { Redis } from "ioredis";

dotenv.config();

const redisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
}

const client = new Redis(process.env.REDIS_URL || "", redisOptions);

client.on("error", (err: any) => {
    logger.error(err.message);

    throw new serverError(err);
});

const pubClient = client.duplicate();
const subClient = client.duplicate();

logger.info("Redis connected");

export { client, pubClient, subClient }