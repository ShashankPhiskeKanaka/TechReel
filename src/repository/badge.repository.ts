import { prisma } from "../../db/prisma.js";
import type { Badge, BadgeData, BadgeUpdateData } from "../dto/badge.dto.js";
import { BaseRepository } from "./base.repository.js";

class BadgeRepository extends BaseRepository<Badge, BadgeData, any> {
    constructor() {
        super(prisma.badges, "Badge");
    }

    create = async (data: BadgeData): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const badge = await tx.badges.create({
                data
            });

            const imageRecord = await tx.images.create({
                data: {
                    imageType: data.imageType ?? "image/png",
                    resourceType: "BADGE",
                    resourceId: badge.id
                }
            });

            return { badge, imageRecord }
        });
    }

    update = async (data: BadgeUpdateData, id: string): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const badge = await tx.badges.update({
                where: {
                    id
                },
                data
            });

            let imageRecord;
            let oldImageRecord;

            if(data.imageType) {
                oldImageRecord = await tx.images.findFirst({
                    where: {
                        resourceId: badge.id
                    }
                });

                imageRecord = await tx.images.update({
                    where: {
                        resourceId: badge.id
                    },
                    data: {
                        imageType: data.imageType
                    }
                });
            }

            return { badge, imageRecord, oldImageRecord }
        });
    }

    hardDelete = async (id: string): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const badge = await tx.badges.delete({
                where:{
                    id
                }
            });

            const imageRecord = await tx.images.delete({
                where: {
                    resourceId: badge.id
                }
            });

            return { badge, imageRecord };
        });
    }
    // /**
    //  * Creates a new badge record.
    //  * @param {BadgeData} data - The badge data to persist.
    //  * @returns {Promise<Badge>} The newly created badge, or an empty object if creation fails.
    //  */
    // create = async (data: BadgeData): Promise<Badge> => {
    //     const badge = await prisma.badges.create({
    //         data: data
    //     });

    //     return badge ?? <Badge>{};
    // }

    /**
     * Retrieves a single active badge by its ID.
     * @param {string} id - The unique identifier of the badge.
     * @returns {Promise<Badge>} The badge object, or an empty object if not found or deleted.
     */
    fetch = async (id: string): Promise<any> => {
        const data: any = await prisma.$queryRaw`        
            SELECT
                b.*,
                i.id AS "imageId",
                i.url AS "url",
                i.type AS "imageType"
            FROM badges b
            LEFT JOIN images i ON i.resource_id = b.id AND i.resource_type = 'BADGE'
            WHERE b.id = ${id}::uuid AND b.deleted_at IS NULL
            LIMIT 1;
        `;

        return data[0] || null;
    }

    // /**
    //  * Fetches a paginated list of badges with search and sorting support.
    //  * 
    //  * @description Implements cursor-based pagination using a composite unique key (createdAt + id) 
    //  * to ensure stable sorting and high performance on large datasets.
    //  * 
    //  * @param {PaginationData} data - Pagination parameters including limit, search, sort, and cursors.
    //  * @returns {Promise<Badge[]>} A list of badge records matching the criteria.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}): Promise<Badge[]> => {

    //     let where: any = {
    //         deletedAt: null,
    //         AND: [
    //             ...(data.search ? [
    //                 {
    //                     OR: {
    //                         name : {
    //                             contains: data.search,
    //                             mode: 'insensitive'
    //                         }
    //                     }
    //                 }
    //             ] : [])
    //         ]
    //     }

    //     where = serverUtils.buildWhere(where, filters, data);

    //     const badges = await prisma.badges.findMany({
    //         take: data.limit ?? 10,
    //         where,
    //         orderBy: [
    //             {createdAt: data.sort as 'asc' | 'desc'},
    //             { id: data.sort as 'asc' | 'desc' }
    //         ]
    //     });

    //     return badges;
    // }

    // /**
    //  * Retrieves all active badges associated with a specific skill.
    //  * @param {string} skillId - The unique identifier of the skill.
    //  * @returns {Promise<Badge[]>} A list of active badges linked to the skill.
    //  */
    // fetchBySkill = async (skillId: string): Promise<Badge[]> => {
    //     const badges = await prisma.badges.findMany({
    //         where: {
    //             skillId,
    //             deletedAt: null
    //         }
    //     });

    //     return badges;
    // }

    // /**
    //  * Updates an existing active badge.
    //  * @param {any} data - The badge data including the ID to update.
    //  * @returns {Promise<Badge>} The updated badge record.
    //  */
    // update = async (data: any): Promise<Badge> => {
    //     const badge = await prisma.badges.update({
    //         where: {
    //             id: data.id,
    //             deletedAt: null
    //         },
    //         data: data
    //     });

    //     return badge;
    // }

    // /**
    //  * Marks a badge as deleted by setting a deletion timestamp.
    //  * @param {string} id - The ID of the badge to soft delete.
    //  * @returns {Promise<Badge>} The updated badge record with the deletion date.
    //  */
    // softDelete = async (id: string): Promise<Badge> => {
    //     const badge = await prisma.badges.update({
    //         where: {
    //             id,
    //             deletedAt: null
    //         },
    //         data: {
    //             deletedAt: new Date()
    //         }
    //     });

    //     return badge;
    // }

    // /**
    //  * Permanently deletes a badge record from the database.
    //  * @param {string} id - The ID of the badge to remove.
    //  * @returns {Promise<Badge>} The deleted badge record.
    //  */
    // hardDelete = async (id: string): Promise<Badge> => {
    //     const badge = await prisma.badges.delete({
    //         where: {
    //             id
    //         }
    //     });

    //     return badge;
    // }
}

export { BadgeRepository }