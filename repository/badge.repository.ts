import { prisma } from "../db/prisma.js";
import type { Badge, BadgeData } from "../dto/badge.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";

class BadgeRepository {

    /**
     * Creates a new badge record.
     * @param {BadgeData} data - The badge data to persist.
     * @returns {Promise<Badge>} The newly created badge, or an empty object if creation fails.
     */
    create = async (data: BadgeData): Promise<Badge> => {
        const badge = await prisma.badges.create({
            data: data
        });

        return badge ?? <Badge>{};
    }

    /**
     * Retrieves a single active badge by its ID.
     * @param {string} id - The unique identifier of the badge.
     * @returns {Promise<Badge>} The badge object, or an empty object if not found or deleted.
     */
    fetch = async (id: string): Promise<Badge> => {
        const badge = await prisma.badges.findFirst({
            where: {
                id,
                deletedAt: null
            }
        });

        return badge ?? <Badge>{};
    }

    /**
     * Fetches a paginated list of badges with search and sorting support.
     * 
     * @description Implements cursor-based pagination using a composite unique key (createdAt + id) 
     * to ensure stable sorting and high performance on large datasets.
     * 
     * @param {PaginationData} data - Pagination parameters including limit, search, sort, and cursors.
     * @returns {Promise<Badge[]>} A list of badge records matching the criteria.
     */
    fetchAll = async (data: PaginationData, filters: {}): Promise<Badge[]> => {

        let where: any = {
            deletedAt: null,
            AND: [
                ...(data.search ? [
                    {
                        OR: {
                            name : {
                                contains: data.search,
                                mode: 'insensitive'
                            }
                        }
                    }
                ] : [])
            ]
        }

        where = serverUtils.buildWhere(where, filters, data);

        const badges = await prisma.badges.findMany({
            take: data.limit ?? 10,
            where,
            orderBy: [
                {createdAt: data.sort as 'asc' | 'desc'},
                { id: data.sort as 'asc' | 'desc' }
            ]
        });

        return badges;
    }

    /**
     * Retrieves all active badges associated with a specific skill.
     * @param {string} skillId - The unique identifier of the skill.
     * @returns {Promise<Badge[]>} A list of active badges linked to the skill.
     */
    fetchBySkill = async (skillId: string): Promise<Badge[]> => {
        const badges = await prisma.badges.findMany({
            where: {
                skillId,
                deletedAt: null
            }
        });

        return badges;
    }

    /**
     * Updates an existing active badge.
     * @param {any} data - The badge data including the ID to update.
     * @returns {Promise<Badge>} The updated badge record.
     */
    update = async (data: any): Promise<Badge> => {
        const badge = await prisma.badges.update({
            where: {
                id: data.id,
                deletedAt: null
            },
            data: data
        });

        return badge;
    }

    /**
     * Marks a badge as deleted by setting a deletion timestamp.
     * @param {string} id - The ID of the badge to soft delete.
     * @returns {Promise<Badge>} The updated badge record with the deletion date.
     */
    softDelete = async (id: string): Promise<Badge> => {
        const badge = await prisma.badges.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        return badge;
    }

    /**
     * Permanently deletes a badge record from the database.
     * @param {string} id - The ID of the badge to remove.
     * @returns {Promise<Badge>} The deleted badge record.
     */
    hardDelete = async (id: string): Promise<Badge> => {
        const badge = await prisma.badges.delete({
            where: {
                id
            }
        });

        return badge;
    }
}

export { BadgeRepository }