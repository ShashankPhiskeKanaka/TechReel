import { Queue } from "bullmq";
import { redisConfig } from "../../src/config/redis.config.js";

const notificationQueue = new Queue("Notification", {
    connection: redisConfig
});

export { notificationQueue };