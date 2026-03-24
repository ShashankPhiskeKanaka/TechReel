import { Worker, Job, increaseMaxListeners } from "bullmq";
import { redisConfig } from "../config/redis.config.js";
import { prisma } from "../db/prisma.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

const interactionWorker = new Worker('REEL_INTERACTION', async (job: Job) => {
    const { reelId, type, process } = job.data;

    try {
        await prisma.reels.updateMany({
            where: {
                id: reelId,
                deletedAt: null
            },
            data: {
                [type == 'LIKE' ? "likes" : "views"]: {
                    [process == "INCREMENT" ? "increment" : "decrement"]: 1
                }
            }
        })
    }catch (err: any) {
        logger.warn("Error while updating reels", {
            reelId
        });
        throw new serverError(err);
    }
}, {
    connection: redisConfig,
    concurrency: 10
});

interactionWorker.on("failed", (job: any, err) => {
    logger.warn(`Job ${job.id} failed: ${err.message}`);
});

export { interactionWorker };