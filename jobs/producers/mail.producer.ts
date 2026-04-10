import { mailQueue } from "../queues/mail.queue.js"

const addMailTask = async (data: any, type: string) => {
    await mailQueue.add("MAIL_TASK",
        {data, type},
        {
            removeOnComplete: true,
            attempts: 3,
            backoff: {
                type: "exponential", delay: 3000
            }
        }
    )
}

export { addMailTask }