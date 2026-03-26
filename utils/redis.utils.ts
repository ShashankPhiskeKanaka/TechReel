import type { Request } from "express";
import { client } from "../caching/redis.client.js";
import { logger } from "./logger.js";
import crypto from "crypto";
import { serverError } from "./error.utils.js";

class RedisUtilsClass {
    generateKey = (req: Request, type: string): string => {
        const userId = type == "PRIVATE" ? req.user?.id : "PUBLIC";
        const resource = (req.baseUrl.split("/").pop() || "GLOBAL").toUpperCase();

        const sortedQuery = Object.keys(req.query).sort().map(key => `${key.toLocaleLowerCase()}=${String(req.query[key])}`).join("&");

        const path = req.path.replace(/\/&/, "");

        return `v1:cache:${userId}:${resource}:${path}:${sortedQuery ? "?" + sortedQuery : ""}`;
    }

    invalidateKey = async (userId: string, resource: string, action: string) => {
        const normalizedResource = resource.toUpperCase();
        const pattern = `v1:cache:${userId}:${normalizedResource}:*`;

        try {
            const stream = client.scanStream({
                match: pattern,
                count: 100,
            });

            stream.on("data", async (keys: string[]) => {
                if (keys.length > 0) {
                    await client.del(...keys);
                }
            });

            stream.on("end", () => {
                logger.info("Redis cache invalidation completed", {
                    pattern,
                    resource: normalizedResource,
                    userId,
                    action
                });
            });

            stream.on("error", (err) => {
                throw err;
            });

        } catch (err: any) {
            logger.error("Error while invalidating redis keys", {
                message: err.message,
                resource: normalizedResource
            });
        }
    };

    generatePayloadHash = (req: Request) => {
        crypto.createHash('sha256').update(JSON.stringify({
            body: req.body,
            url: req.originalUrl,
            method: req.method
        })).digest("hex");
    }

    updateLike = async (req: Request, process: "INCREMENT" | "DECREMENT") => {
        try {
            const key = this.generateKey(req, "PUBLIC");
            const exists = await client.exists(key);
            if(exists){
                const value = process == "INCREMENT" ? 1 : -1;

                await client.call(
                    `JSON.NUMINCRBY`,
                    key,
                    '$.likes',
                    value
                );

                logger.info(`Cache updated for reel`, {
                    cacheKey: key,
                    type: "LIKE",
                    process
                });
            }
        }catch (err: any) {
            throw new serverError(err);
        }
    }
}

const redisUtils = new RedisUtilsClass();

export { RedisUtilsClass, redisUtils }