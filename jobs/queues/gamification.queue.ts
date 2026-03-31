import { Queue } from "bullmq";
import { redisConfig } from "../../src/config/redis.config.js";

const gamificationQueue = new Queue("GAMIFICATION", {
    connection: redisConfig
});

export { gamificationQueue }