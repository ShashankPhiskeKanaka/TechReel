import { prisma } from "../db/prisma.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { StreakData, Streak } from "../dto/streak.dto.js";
import { serverUtils } from "../utils/server.utils.js";

class StreakRepository {

    /**
      * Creates a new streak record for a user.
      * @param {StreakData} data - The initial streak data.
      * @returns {Promise<Streak>} The newly created streak.
      */
    create = async (data: StreakData): Promise<Streak> => {
        const streak = await prisma.streaks.create ({
            data: data
        });

        return streak;
    }

    /**
     * Retrieves a streak record by its unique ID or by User ID.
     * @param {string} id - The unique identifier of the streak or user.
     * @returns {Promise<Streak>} The streak object or an empty object if not found.
     */
    fetch = async (id: string): Promise<Streak> => {
        const streak = await prisma.streaks.findFirst({
            where: {
                OR: [
                    {
                        id
                    },
                    {
                        userId: id
                    }
                ]
            }
        });

        return streak ?? <Streak>{};
    }

    /**
     * Retrieves a paginated list of streaks based on filters.
     * @param {PaginationData} data - Pagination and sorting settings.
     * @param {Object} filters - Key-value pairs for filtering the results.
     * @returns {Promise<Streak[]>} A list of streaks matching the criteria.
     */
    fetchAll = async (data: PaginationData, filters: {}): Promise<Streak[]> => {
        let where: any = {
            AND:[]
        }

        where = serverUtils.buildWhere(where, filters, data);

        const streaks = await prisma.streaks.findMany({
            take: data.limit ?? PaginationConstants.limit,
            where,
            orderBy: [
                {lastActive: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
                {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
            ]
        });

        return streaks;
    }

    /**
     * Increments the current streak and updates the longest streak if the record is broken.
     * Uses a transaction to ensure data consistency.
     * @param {string} userId - The ID of the user whose streak is being updated.
     * @returns {Promise<void>}
     */
    update = async (userId: string) => {
        return await prisma.$transaction(async (tx) => {
            const updatedStreak = await tx.streaks.update({
                where: {
                    userId
                },
                data: {
                    currentStreak: {
                        increment: 1
                    }
                }
            });

            if(updatedStreak.currentStreak > updatedStreak.longestStreak) {
                await tx.streaks.update({
                    where: {
                        userId
                    },
                    data: {
                        longestStreak: updatedStreak.currentStreak
                    }
                });
            }
        })
    }

    /**
     * Resets the current streak to zero without deleting the record.
     * @param {string} userId - The ID of the user to reset.
     * @returns {Promise<Streak>} The updated streak record.
     */
    softDelete = async (userId: string): Promise<Streak> => {
        const streak = await prisma.streaks.update({
            where: {
                userId
            },
            data: {
                currentStreak: 0
            }
        });

        return streak;
    }

    /**
     * Permanently removes a streak record from the database.
     * @param {string} id - The ID of the streak record to delete.
     * @returns {Promise<Streak>} The deleted streak record.
     */
    hardDelete = async (id: string): Promise<Streak> => {
        const streak = await prisma.streaks.delete({
            where: {
                id: id
            }
        });

        return streak;
    }
}

export { StreakRepository }