import { Queue } from "bullmq";
import { redisConfig } from "../../src/config/redis.config.js";

const mailQueue = new Queue("Mail", {
    connection: redisConfig
});

export { mailQueue }