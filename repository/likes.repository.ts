import { prisma } from "../db/prisma.js";
import type { Like, LikeData } from "../dto/likes.dto.js";

class LikesRepository {

    /**
     * Atomically creates a like record and increments the reel's like counter.
     * 
     * @param {LikeData} data - Object containing user_id and reel_id.
     * @returns {Promise<Object>} The created like record.
     * @throws {Error} If the reel is not found (or deleted) or if a duplicate like is attempted.
     */
    create = async (data: LikeData ) => {
        return await prisma.$transaction(async (tx) => {
            await tx.reels.update({
                where: {
                    id: data.reel_id,
                    deleted_at: null
                },
                data: {
                    likes: {
                        increment: 1
                    }
                }
            });

            const like = await tx.reel_likes.create({
                data: data
            });

            return like;
        });
    }
    /**
     * Retrieves a specific like record for a user-reel pair.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @param {string} userId - The unique identifier of the user.
     * @returns {Promise<Like>} The matching like record or an empty object if not found.
     * @note Uses findFirst to locate the record based on the composite criteria.
     */
    fetch = async (reelId: string, userId: string) : Promise<Like> => {
        const like = await prisma.reel_likes.findFirst({
            where: {
                reel_id: reelId,
                user_id: userId
            }
        });

        return like ?? <Like>{};
    }

    /**
     * Retrieves the denormalized likes count from the reels table.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<number>} The total number of likes, or 0 if the reel is not found/deleted.
     * @note This is more performant than counting the reel_likes table for high-traffic feeds.
     */
    fetchLikesCount = async (reelId: string) => {
        const reel = await prisma.reels.findUnique({
            where: {
                id: reelId,
                deleted_at: null
            },
            select: {
                likes: true
            }
        });

        return reel?.likes ?? 0;
    }

    /**
     * Retrieves all individual like records associated with a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<reel_likes[]>} An array of like records containing user IDs and timestamps.
     * @note Use this for "liked by" lists; for simple counts, use the denormalized column instead.
     */
    fetchLikesRecords = async (reelId: string) => {
        const likes = await prisma.reel_likes.findMany({
            where: {
                reel_id: reelId
            }
        });

        return likes;
    }

    /**
     * Atomically removes a like record and decrements the reel's like counter.
     * 
     * @param {string} userId - The unique identifier of the user unliking the reel.
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<number>} The number of records deleted (should be 1 or 0).
     * @note Wrapped in a transaction to ensure the counter stays in sync with the likes table.
     */
    delete = async (userId: string, reelId: string) => {
        return await prisma.$transaction(async (tx) => {
            await tx.reels.update({
                where: {
                    id: reelId,
                    deleted_at: null
                },
                data: {
                    likes: {
                        decrement: 1
                    }
                }
            });

            const like = await prisma.reel_likes.deleteMany({
                where: {
                    user_id: userId,
                    reel_id: reelId
                }
            });

            return like.count;
        })
    }
}

export { LikesRepository }