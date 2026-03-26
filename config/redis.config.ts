import type { ConnectionOptions } from "bullmq";

const redisConfig: ConnectionOptions = {
    url: process.env.REDIS_URL || "",
    maxRetriesPerRequest: null
}

export { redisConfig }