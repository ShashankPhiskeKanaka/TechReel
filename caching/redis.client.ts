import { createClient } from "redis";
import { serverError } from "../utils/error.utils.js";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL || ""
});

client.on("error", (err) => {
    logger.error(err.message);

    throw new serverError(err);
});

try{
    await client.connect();
}
catch (err: any) {
    logger.error("Error while connecting to redis");

    throw new serverError(err);
}

const pubClient = client.duplicate();
const subClient = client.duplicate();

logger.info("Redis connected");

export { client, pubClient, subClient }