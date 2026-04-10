import { Job, Worker } from "bullmq"
import { config } from "../../src/config/index.js"
import { redisConfig } from "../../src/config/redis.config.js"
import { logger } from "../../src/utils/logger.js";
import { pubClient } from "../../caching/redis.client.js";

const notificationWorker = new Worker("Notification", async (job: Job) => {

    const { data, type } = job.data;
    const channel = `notifications:${data.userId}`;

    logger.info("Working on notification job", {
        type
    });

    switch(type) {
        case "GAMIFICATION":
            await pubClient.publish(channel, JSON.stringify(data));
            logger.info("Gamification notification sent");
            return;

        case "REEL":           
            await pubClient.publish(channel, JSON.stringify(data));
            logger.info("Reel notification sent");
            return;
        
        default:
            logger.warn("Invalid type");
            return;
    }

}, {
    connection: redisConfig,
    concurrency: 10
});

notificationWorker.on("failed", (job: any, err: any) => {
    logger.warn(`Job faild: ${job.id}, error: ${err.message}`);
});

export { notificationWorker }