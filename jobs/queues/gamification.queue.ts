import { Queue } from "bullmq";
import { redisConfig } from "../../config/redis.config.js";

const gamificationQueue = new Queue("GAMIFICATION", {
    connection: redisConfig
});

export { gamificationQueue }