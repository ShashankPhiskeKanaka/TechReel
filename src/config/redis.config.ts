import type { ConnectionOptions } from "bullmq";
import { config } from "./index.js";

const redisConfig: ConnectionOptions = {
    url: config.redisUrl,
    maxRetriesPerRequest: null
}

export { redisConfig }