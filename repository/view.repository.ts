import { prisma } from "../db/prisma.js";
import type { View, ViewData } from "../dto/view.dto.js";

class ViewRepository {

    /**
     * Atomically creates a reel view record and increments the global view counter.
     * 
     * @param {ViewData} data - Object containing reelId, userId, completion status, and duration.
     * @returns {Promise<View>} The created view record.
     * @note Wrapped in a transaction to ensure the reels table counter stays in sync with the view ledger.
     */
    createViewRecord = async (data: ViewData) : Promise<View> => {
        return await prisma.$transaction(async (tx) => {
            
            await tx.reels.update({
                where: {
                    id: data.reelId,
                    deleted_at: null
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
            
            const viewRecord = await prisma.reel_views.create({
                data: {
                    reel_id: data.reelId,
                    user_id: data.userId,
                    completed: data.completed,
                    watched_seconds: data.watchedSeconds
                }
            });

            return viewRecord;
        })
    }

    /**
     * Retrieves a specific view record by its unique identifier.
     * 
     * @param {string} id - The unique ID of the view record (UUID).
     * @returns {Promise<View>} The found view record or an empty object if not found.
     * @note This performs a direct primary key lookup for audit or detail views.
     */
    fetchViewRecord = async (id: string) : Promise<View> => {
        const viewRecord = await prisma.reel_views.findUnique({
            where: {
                id: id
            }
        });

        return viewRecord ?? <View>{};
    }

    /**
     * Retrieves the complete viewing history for a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel (UUID).
     * @returns {Promise<View[]>} An array of view records, including durations and completion status.
     */
    fetchViewRecordsByReel = async (reelId: string): Promise<View[]> => {
        const viewRecords = await prisma.reel_views.findMany({
            where: {
                reel_id: reelId
            }
        });

        return viewRecords;
    }

    /**
     * Retrieves the complete viewing history for a specific user.
     * 
     * @param {string} userId - The unique identifier of the user (UUID).
     * @returns {Promise<View[]>} An array of view records, including durations and completion status.
     */
    fetchViewRecordsByUser = async (userId: string): Promise<View[]> => {
        const viewRecords = await prisma.reel_views.findMany({
            where: {
                user_id: userId
            }
        });

        return viewRecords;
    }

    /**
     * Retrieves the denormalized view count for a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<number>} The total number of views, or 0 if the reel is not found/deleted.
     * @note Fetches directly from the 'reels' table for better performance than counting the views ledger.
     */
    fetchTotalViews = async (reelId: string) => {
        const reel = await prisma.reels.findFirst({
            where: {
                id: reelId,
                deleted_at: null
            },
            select: {
                views: true
            }
        });

        return reel?.views ?? 0;   
    }

    /**
     * Permanently deletes a specific view record from the database.
     * 
     * @param {string} id - The unique ID of the view record to remove.
     * @returns {Promise<View>} The deleted view record data.
     * @throws {Error} If the record ID is not found or already deleted.
     */
    deleteView = async (id: string, reelId: string): Promise<View> => {
        return await prisma.$transaction(async (tx) => {
            await tx.reels.update({
                where: {
                    id: reelId,
                    deleted_at: null
                },
                data: {
                    views : {
                        decrement: 1
                    }
                }
            });
            
            const view = await prisma.reel_views.delete({
                where: {
                    id
                }
            });

            return view;
        })
    }

}

export { ViewRepository };