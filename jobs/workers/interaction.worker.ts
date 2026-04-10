import { Worker, Job, increaseMaxListeners } from "bullmq";
import { redisConfig } from "../../src/config/redis.config.js";
import { prisma } from "../../db/prisma.js";
import { serverError } from "../../src/utils/error.utils.js";
import { logger } from "../../src/utils/logger.js";
import { redisUtils } from "../../src/utils/redis.utils.js";

const interactionWorker = new Worker('REEL_INTERACTION', async (job: Job) => {
    const { data, type } = job.data;

    logger.info("Worker working on job", {
        type
    })

    try {
        switch (type) {
            case "LIKE":
                return await prisma.$transaction(async (tx) => {
                    await tx.reels.update({
                        where: {
                            id: data.reelId,
                            deletedAt: null
                        },
                        data: {
                            likes: {
                                [data.process == "INCREMENT" ? "increment" : "decrement"]: 1
                            }
                        }
                    });

                    if (data.process == "INCREMENT") {
                        await tx.reel_likes.create({
                            data: {
                                reelId: data.reelId,
                                userId: data.userId
                            }
                        });

                        logger.info("Like record created", {
                            reelId: data.reelId,
                            userId: data.userId
                        });
                    } else {
                        await tx.reel_likes.deleteMany({
                            where: {
                                reelId: data.reelId,
                                userId: data.userId
                            }
                        });

                        logger.info("Like record deleted", {
                            reelId: data.reelId,
                            userId: data.userId
                        });
                    }

                    await redisUtils.sendNotification(data.userId, {
                        message: data.process == "INCREMENT" ? "Liked reel" : "Unliked reel",
                        reelId: data.reelId
                    });

                });

            case "VIEW":
                return await prisma.$transaction(async (tx) => {

                    if (data.process == "REWATCHED") {
                        await tx.reel_views.updateMany({
                            where: {
                                reelId: data.reelId,
                                userId: data.userId,
                            },
                            data: {
                                watchedSeconds: data.watchedSeconds,
                                completed: data.completed
                            }
                        })
                        logger.info("View record updated", {
                            reelId: data.reelId,
                            userId: data.userId
                        });
                    } else {
                        await tx.reel_views.create({
                            data: {
                                reelId: data.reelId,
                                userId: data.userId,
                                watchedSeconds: data.watchedSeconds,
                                completed: data.completed
                            }
                        });
                        logger.info("View record created", {
                            reelId: data.reelId,
                            userId: data.userId
                        });

                        await tx.reels.update({
                            where: {
                                id: data.reelId,
                                deletedAt: null
                            },
                            data: {
                                views: {
                                    increment: 1
                                }
                            }
                        });
                    }

                    await redisUtils.sendNotification(data.userId, {
                        message: "View persisted successfully",
                        reelId: data.reelId
                    });
                });
            default:
                logger.warn("Unhandles interaction type", {
                    type
                });
                return;
        }
    } catch (err: any) {
        throw new serverError(err);
    }
}, {
    connection: redisConfig,
    concurrency: 10
});

interactionWorker.on("failed", (job: any, err) => {
    logger.warn(`Job ${job.id} failed: ${err.message}`);
});

export { interactionWorker };