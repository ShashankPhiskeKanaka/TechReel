import type { Request } from "express";
import { client } from "../caching/redis.client.js";
import { logger } from "./logger.js";
import crypto from "crypto";

class RedisUtilsClass {
    generateKey = (req: Request): String => {
        const userId = req.user?.id || "public";
        const resource = req.baseUrl.split("/").pop() || "global";

        const sortedQuery = Object.keys(req.query).sort().map(key => `${key.toLocaleLowerCase()}=${String(req.query[key])}`).join("&");

        const path = req.path.replace(/\/&/, "");

        return `v1:cache:${userId}:${resource}:${path}:${sortedQuery ? "?" + sortedQuery : ""}`;
    }

    invalidateKey = async (userId: string, resource: string) => {
        const pattern = `v1:cache:${userId}:${resource}:*`;

        try{
            if(!pattern.includes("*")) {
                await client.del(pattern);
                return;
            }

            const keys: string[] = [];

            for await (const key of client.scanIterator({
                MATCH: pattern,
                COUNT: 100
            })){
                keys.push(...key);
            }

            if(keys.length > 0) {
                await client.del(keys);
            }

            logger.info("Redis cache cleared", {
                pattern
            });
        }catch (err: any) {
            logger.error("Error while invalidating redis keys", {
                message: err.message,
                status: err.status
            });
        } 
    }

    generatePayloadHash = (req: Request) => {
        crypto.createHash('sha256').update(JSON.stringify({
            body: req.body,
            url: req.originalUrl,
            method: req.method
        })).digest("hex");
    }
}

const redisUtils = new RedisUtilsClass();

export { RedisUtilsClass, redisUtils }