import { gamificationQueue } from "../queues/gamification.queue.js"

const addGamificationTask = async (data: any) => {
    await gamificationQueue.add("GAMIFICATION_TASK",
        { data },
        {
            removeOnComplete: true,
            attempts: 3,
            backoff: {
                type: 'exponential', delay: 1000
            }
        }
    )
}

export { addGamificationTask }