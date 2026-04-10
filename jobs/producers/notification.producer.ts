import { notificationQueue } from "../queues/notification.queue.js"

const addNotificationTask = async (data: any, type: string) => {
    await notificationQueue.add("NOTIFICATION_TASK", 
        { data, type },
        {
            removeOnComplete: true,
            attempts: 3,
            backoff: {
                type:"exponential",
                delay:3000
            }
        }
    )
}

export { addNotificationTask }