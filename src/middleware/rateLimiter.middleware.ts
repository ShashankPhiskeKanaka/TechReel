import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { client } from "../../caching/redis.client.js";
import type { Request } from "express";
import { logger } from "../utils/logger.js";

const rateLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args: string[]) => (client as any).call(...args) as Promise<any>,
        prefix: 'v1:ratelimit:',
    }),

    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req: Request) => {
        return req.headers['x-api-key']?.toString() || req.ip || "anonymous";
    },

    validate: { xForwardedForHeader: false, default: false },

    handler: (req, res, next) => {
        logger.warn("Too many requests", {
            ip: req.ip
        });

        res.status(429).json({
            error: "Too many requests",
            message: "You have exceeded the request limit"
        });
    },

    standardHeaders: true,
    legacyHeaders: false
});

export { rateLimiter }