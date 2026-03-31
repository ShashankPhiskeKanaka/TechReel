import { prisma } from "../../db/prisma.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { View, ViewData } from "../dto/view.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class ViewRepository extends BaseRepository<View, ViewData, any> {

    constructor() {
        super(prisma.reel_views, "View");
    }

    /**
     * Atomically creates a reel view record and increments the global view counter.
     * 
     * @param {ViewData} data - Object containing reelId, userId, completion status, and duration.
     * @returns {Promise<View>} The created view record.
     * @note Wrapped in a transaction to ensure the reels table counter stays in sync with the view ledger.
     */
    createViewRecord = async (data: ViewData): Promise<View> => {
        return await prisma.$transaction(async (tx) => {

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

            const viewRecord = await tx.reel_views.create({
                data: data
            });

            return viewRecord;
        })
    }

    // /**
    //  * Retrieves a paginated list of reel views with optional filtering by user or reel.
    //  * @param {PaginationData} data - Pagination and sorting settings.
    //  * @param {Object} filters - Dynamic filters processed by serverUtils.
    //  * @param {string} [userId] - Optional filter for views by a specific user.
    //  * @param {string} [reelId] - Optional filter for views on a specific reel.
    //  * @returns {Promise<View[]>} A list of matching reel view records.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<View[]> => {
    //     let where: any = {
    //         AND: []
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const viewRecords = await prisma.reel_views.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             { createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' },
    //             { id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return viewRecords;
    // }

    /**
     * Retrieves the denormalized view count for a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<number>} The total number of views, or 0 if the reel is not found/deleted.
     * @note Fetches directly from the 'reels' table for better performance than counting the views ledger.
     */
    fetchViews = async (reelId: string) => {
        const reel = await prisma.reels.findFirst({
            where: {
                id: reelId,
                deletedAt: null
            },
            select: {
                views: true
            }
        });

        return reel?.views ?? 0;
    }

    // /**
    //  * Permanently deletes a specific view record from the database.
    //  * 
    //  * @param {string} id - The unique ID of the view record to remove.
    //  * @returns {Promise<View>} The deleted view record data.
    //  * @throws {Error} If the record ID is not found or already deleted.
    //  */
    // deleteView = async (id: string, reelId: string): Promise<View> => {
    //     return await prisma.$transaction(async (tx) => {
    //         await tx.reels.update({
    //             where: {
    //                 id: reelId,
    //                 deletedAt: null
    //             },
    //             data: {
    //                 views : {
    //                     decrement: 1
    //                 }
    //             }
    //         });

    //         const view = await prisma.reel_views.delete({
    //             where: {
    //                 id
    //             }
    //         });

    //         return view;
    //     })
    // }

}

export { ViewRepository };