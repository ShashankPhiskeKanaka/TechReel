import { Queue } from "bullmq";
import { client } from "../caching/redis.client.js";
import { redisConfig } from "../config/redis.config.js";

const interactionQueue = new Queue('REEL_INTERACTION', {
    connection: redisConfig,
});

const addInteractionTask = async (reelId: string, type: 'LIKE' | 'VIEW', process: "INCREMENT" | "DECREMENT") => {
    await interactionQueue.add("UPDATE_REEL_STATS", 
        {reelId, type, process},
        {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 }
        }
    );
}

export { interactionQueue, addInteractionTask }