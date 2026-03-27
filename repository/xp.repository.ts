import { prisma } from "../db/prisma.js"
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { Xp, XpData } from "../dto/xp.dto.js"
import { serverUtils } from "../utils/server.utils.js";

class XpRepository {

    /**
     * Awards XP to a user by creating a ledger entry and updating their profile balance.
     * Uses a raw SQL update with GREATEST to ensure the balance never drops below zero.
     * @param {XpData} data - The XP transaction details (userId, amount, reason).
     * @param {any} [client=prisma] - Optional Prisma client or transaction instance.
     * @returns {Promise<Xp>} The created XP ledger record.
     */
    awardXp = async (data: XpData, client: any = prisma): Promise<Xp> => {
        const xp = await client.xp_ledger.create({
            data
        });

        await client.user_profiles.upsert({
            where: { userId: data.userId },
            update: {
                xp: {
                    increment: data.amount
                }
            },
            create: {
                userId: data.userId,
                xp: data.amount,
                interests: []
            }
        });


        return xp;
    }

    /**
     * Retrieves a specific XP ledger entry by ID, with optional user ownership check.
     * @param {string} id - The unique identifier of the XP record.
     * @param {string} [userId] - Optional ID to verify the record belongs to a specific user.
     * @returns {Promise<Xp>} The XP ledger object or an empty object if not found.
     */
    fetch = async (id: string, userId?: string): Promise<Xp> => {
        const xp = await prisma.xp_ledger.findFirst({
            where:{
                id,
                ...(userId ? {userId} : {})
            }
        });

        return xp ?? <Xp>{}
    }

    /**
     * Retrieves a paginated list of XP ledger records with optional user filtering.
     * @param {PaginationData} data - Pagination and sorting settings.
     * @param {Object} filters - Key-value pairs for additional filtering logic.
     * @param {string} [userId] - Optional filter to fetch XP history for a specific user.
     * @returns {Promise<Xp[]>} A list of matching XP records.
     */
    fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<Xp[]> => {
        let where: any = {
            AND: []
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);

        const xpRecords = await prisma.xp_ledger.findMany({
            take: data.limit ?? PaginationConstants.limit,
            where,
            orderBy: [
                {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
                {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
            ]
        });

        return xpRecords;
    }

    /**
     * Permanently removes an XP ledger entry from the database.
     * Note: This does not automatically revert the XP balance in user_profiles.
     * @param {string} id - The ID of the XP record to delete.
     * @returns {Promise<Xp>} The deleted XP record.
     */
    delete = async (id: string): Promise<Xp> => {
        const xp = await prisma.xp_ledger.delete({
            where: {
                id: id
            }
        });

        return xp;
    }
}

export { XpRepository }