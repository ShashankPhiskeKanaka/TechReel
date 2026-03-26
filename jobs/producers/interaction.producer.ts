import { interactionQueue } from "../queues/interaction.queue.js";

const addInteractionTask = async (data: any, type: 'LIKE' | 'VIEW') => {
    await interactionQueue.add("UPDATE_REEL_STATS",
        { data, type },
        {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 }
        }
    );
}

export { addInteractionTask }