import { Queue } from "bullmq";
import { client } from "../../caching/redis.client.js";
import { redisConfig } from "../../config/redis.config.js";

const interactionQueue = new Queue('REEL_INTERACTION', {
    connection: redisConfig,
});

export { interactionQueue }