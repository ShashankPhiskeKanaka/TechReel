import { prisma } from "../db/prisma.js";
import type { Like, LikeData } from "../dto/like.dto.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class LikeRepository extends BaseRepository<Like, LikeData, any> {

    constructor() {
        super(prisma.reel_likes, "Like");
    }

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
                    id: data.reelId,
                    deletedAt: null
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
    // /**
    //  * Retrieves a specific like record for a user-reel pair.
    //  * 
    //  * @param {string} reelId - The unique identifier of the reel.
    //  * @param {string} userId - The unique identifier of the user.
    //  * @returns {Promise<Like>} The matching like record or an empty object if not found.
    //  * @note Uses findFirst to locate the record based on the composite criteria.
    //  */
    // fetch = async (reelId: string, userId: string) : Promise<Like> => {
    //     const like = await prisma.reel_likes.findFirst({
    //         where: {
    //             reelId,
    //             userId
    //         }
    //     });

    //     return like ?? <Like>{};
    // }

    // /**
    //  * Retrieves a paginated list of reel likes with flexible scoping.
    //  * 
    //  * @description Supports multi-dimensional filtering by user, reel, or both. 
    //  * Implements keyset pagination (id + createdAt) to ensure stable ordering 
    //  * across high-volume interaction data.
    //  * 
    //  * @param {PaginationData} data - Pagination metadata including limit, sort, and cursors.
    //  * @param {string} [userId] - Optional ID to filter likes by a specific user.
    //  * @param {string} [reelId] - Optional ID to filter likes for a specific reel.
    //  * @returns {Promise<Like[]>} A collection of like records matching the criteria.
    //  */
    // fetchLikes = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<Like[]> => {

    //     let where: any = {
    //         AND:[]
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const likes = await prisma.reel_likes.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             { id: data.sort as 'asc' | 'desc' },
    //             { createdAt: data.sort as 'asc' | 'desc' }
    //         ]
    //     });

    //     return likes;
    // }

    /**
     * Retrieves the denormalized likes count from the reels table.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<number>} The total number of likes, or 0 if the reel is not found/deleted.
     * @note This is more performant than counting the reel_likes table for high-traffic feeds.
     */
    fetchLikeCount = async (reelId: string) => {
        const reel = await prisma.reels.findUnique({
            where: {
                id: reelId,
                deletedAt: null
            },
            select: {
                likes: true
            }
        });

        return reel?.likes ?? 0;
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
                    deletedAt: null
                },
                data: {
                    likes: {
                        decrement: 1
                    }
                }
            });

            const like = await prisma.reel_likes.deleteMany({
                where: {
                    userId,
                    reelId
                }
            });

            return like.count;
        })
    }
}

export { LikeRepository }