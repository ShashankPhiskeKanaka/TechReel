import { createClient } from "redis";
import { serverError } from "../src/utils/error.utils.js";
import dotenv from "dotenv";
import { logger } from "../src/utils/logger.js";
import { Redis } from "ioredis";
import { config } from "../src/config/index.js";

dotenv.config();

const redisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
}

const client = new Redis(config.redisUrl, redisOptions);

client.on("error", (err: any) => {
    logger.error(err.message);

    throw new serverError(err);
});

const pubClient = client.duplicate();
const subClient = client.duplicate();

logger.info("Redis connected");

export { client, pubClient, subClient }