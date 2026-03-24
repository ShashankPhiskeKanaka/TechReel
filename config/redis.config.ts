import type { ConnectionOptions } from "bullmq";

const redisConfig: ConnectionOptions = {
    host: process.env.REDIS_URL || "",
    maxRetriesPerRequest: null
}

export { redisConfig }