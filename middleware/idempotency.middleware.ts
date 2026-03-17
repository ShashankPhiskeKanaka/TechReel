import type { NextFunction, Request, Response } from "express"
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";
import { client } from "../caching/redis.client.js";

class IdempotencyMiddleware {
    constructor (private CacheClient : any) {}

    handle = (ttl: number) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const key = req.headers['idempotency-key'] as string;
            if(req.method == 'GET') return next();

            if(!key) {
                logger.warn("No request key provided", {
                    ip: req.ip
                });

                return res.status(400).json({
                    success: false,
                    message: "Invalid request"
                });
            }

            const redisKey = `idem:${key}`;

            const requestHash = redisUtils.generatePayloadHash(req);

            try{
                const cached = await this.CacheClient.get(redisKey);
                if(cached) {
                    const { status, body, hash, state } = JSON.parse(cached);

                    if(hash != requestHash) {
                        logger.error("Idempotency key reused", {
                            key: key,
                            ip: req.ip
                        });
                    }

                    logger.info("Idempotency 'Replay'", {
                        key: key,
                        ip: req.ip
                    });

                    return res.status(status).set('X-Idempotency-Replay', 'true').json({
                        success: true,
                        data: body
                    });
                }

                const locked = await this.CacheClient.set(redisKey, JSON.stringify({ state: "STARTEd", hash: requestHash }), "EX", process.env.CACHE_TTL_SHORT, 'NX');
                if(!locked) {
                    logger.warn("Idempotency Error: Request in process", {
                        ip: req.ip,
                        key: key
                    });

                    return res.status(409).json({
                        success: false,
                        message: "Request in process"
                    });
                }

                const originalJson = res.json.bind(res);

                res.json = (body: any) : Response => {
                    if(res.statusCode < 500) {
                        const responsePayload = { state: "COMPLETED", hash: requestHash, status: res.statusCode, body };
                        this.CacheClient.set(redisKey, JSON.stringify(responsePayload), 'EX', process.env.CACHE_TTL_SHORT);
                    }else{
                        this.CacheClient.del(redisKey);
                    }

                    return originalJson(body);
                }

                return next();
            }catch (err: any) {
                logger.error(err.message, {
                    ip: req.ip
                });
            }

        }
    }
}

const idempotency = new IdempotencyMiddleware(client);
const idempotencyMiddleware = idempotency.handle(Number(process.env.CACHE_TTL_LONG) ?? 86400);

export { idempotencyMiddleware };