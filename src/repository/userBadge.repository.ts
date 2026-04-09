import { prisma } from "../../db/prisma.js";
import type { UserBadge, UserBadgeData } from "../dto/badge.dto.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class UserBadgesRepository extends BaseRepository<UserBadge, UserBadgeData, any> {
    constructor() {
        super(prisma.user_badges, "User badge");
    }

    /**
     * Awards a badge to a user based on a specific skill ID.
     * Searches for an active badge linked to the skill and creates a user association.
     * @param {UserBadgeData} data - Contains the userId and skillId to match.
     * @param {any} [client=prisma] - Optional Prisma client or transaction instance.
     * @returns {Promise<Badge | null>} The badge that was awarded, or null if not found.
     */
    awardBadge = async (data: UserBadgeData, client: any = prisma) => {
        const badge = await client.badges.findFirst({
            where: {
                skillId: data.skillId,
                deletedAt: null
            }
        });

        const userBadge = await client.user_badges.create({
            data: {
                userId: data.userId,
                badgeId: badge?.id ?? "NA",
            }
        });

        return { badge, userBadge };
    }

    // /**
    //  * Retrieves a specific user-badge assignment by its ID.
    //  * @param {string} id - The unique ID of the user_badge record.
    //  * @returns {Promise<UserBadge>} The user-badge record or an empty object if not found.
    //  */
    // fetch = async (id: string, userId?: string): Promise<UserBadge> => {
    //     const userBadge = await prisma.user_badges.findFirst({
    //         where: {
    //             id,
    //             ...(userId ? {userId} : {})
    //         }
    //     });

    //     return userBadge ?? <UserBadge>{};
    // }

    // /**
    //  * Retrieves a paginated list of user-badge assignments based on filters.
    //  * @param {PaginationData} data - Pagination and sorting settings.
    //  * @param {Object} filters - Key-value pairs for filtering the results.
    //  * @param {string} userId - The ID of the user (currently unused in the logic).
    //  * @returns {Promise<UserBadge[]>} A list of matching user-badge records.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<UserBadge[]> => {

    //     let where: any = {
    //         AND: []
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const userBadges = await prisma.user_badges.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
    //             {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return userBadges;
    // }

    // /**
    //  * Permanently removes a badge assignment from a user.
    //  * @param {string} id - The ID of the user_badge record to delete.
    //  * @returns {Promise<UserBadge>} The deleted record.
    //  */
    // delete = async (id: string): Promise<UserBadge> => {
    //     const userBadge = await prisma.user_badges.delete({
    //         where: {
    //             id
    //         }
    //     });

    //     return userBadge;
    // }
}

export { UserBadgesRepository };