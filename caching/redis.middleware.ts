import type { NextFunction, Request, Response } from "express"
import { redisUtils } from "../src/utils/redis.utils.js";
import { logger } from "../src/utils/logger.js";
import { serverError } from "../src/utils/error.utils.js";

class CacheMiddlewareClass {
    constructor(private cacheClient: any) { }

    cacheRequest = (ttl: number, type: "PUBLIC" | "PRIVATE" = "PUBLIC") => {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.method != "GET") {
                return next();
            }

            const key = redisUtils.generateKey(req, type);

            try {
                const cachedResponse = await this.cacheClient.get(key);

                if (cachedResponse) {
                    logger.info("Cache 'Hit' for key", {
                        key
                    });

                    return res.json(JSON.parse(cachedResponse));
                }

                logger.info("Cache 'Miss' for key", {
                    key
                });

                const originalJson = res.json.bind(res);

                res.json = (body: any): Response => {
                    // Set the cache and continue with original response
                    this.cacheClient.setex(key, ttl, JSON.stringify(body));
                    return originalJson(body);
                };

                return next();
            } catch (err: any) {
                logger.error("Error while caching request", {
                    message: err.message,
                    status: err.status
                });

                next(new serverError(err));
            }
        }
    }
}

export { CacheMiddlewareClass }