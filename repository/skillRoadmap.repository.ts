import { prisma } from "../db/prisma.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { SkillRoadmap, SkillRoadmapData } from "../dto/skill.dto.js";
import { serverUtils } from "../utils/server.utils.js";

class SkillRoadmapRepository {

    /**
     * Creates a new skill roadmap entry.
     * @param {SkillRoadmapData} data - The roadmap details to persist.
     * @returns {Promise<SkillRoadmap>} The newly created roadmap.
     */
    create = async (data: SkillRoadmapData): Promise<SkillRoadmap> => {
        const skillRoadmap = await prisma.skill_roadmaps.create({
            data: data
        });

        return skillRoadmap;
    }

    /**
     * Retrieves a specific skill roadmap by its unique ID.
     * @param {string} id - The ID of the roadmap to fetch.
     * @returns {Promise<SkillRoadmap>} The roadmap object, or an empty object if not found.
     */
    fetch = async (id: string): Promise<SkillRoadmap> => {
        const skillRoadmap = await prisma.skill_roadmaps.findFirst({
            where: {
                id
            }
        });

        return skillRoadmap ?? <SkillRoadmap>{};
    }

    /**
     * Retrieves a paginated list of skill roadmaps with case-insensitive title search.
     * @param {PaginationData} data - Pagination and search settings (limit, sort, search term).
     * @param {Object} filters - Additional filtering criteria.
     * @returns {Promise<SkillRoadmap[]>} A list of roadmaps matching the search and filter criteria.
     */
    fetchAll = async (data: PaginationData, filters: {}): Promise<SkillRoadmap[]> => {

        let where: any = {
            AND: [
                {
                    OR: [
                        {
                            title: {
                                contains: data.search,
                                case: 'insensitive'
                            }
                        }
                    ]
                }
            ]
        }

        where = serverUtils.buildWhere(where, filters, data);

        const skillRoadmaps = await prisma.skill_roadmaps.findMany({
            take: data.limit ?? PaginationConstants.limit,
            where,
            orderBy: [
                {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' },
                { id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
            ]
        });

        return skillRoadmaps;
    }


    /**
     * Updates an existing skill roadmap.
     * @param {any} data - The updated data fields.
     * @param {string} id - The ID of the roadmap to update.
     * @returns {Promise<SkillRoadmap>} The updated roadmap record.
     */

    update = async (data: any, id: string): Promise<SkillRoadmap> => {
        const skillRoadmap = await prisma.skill_roadmaps.update({
            where: {
                id
            },
            data: data
        });

        return skillRoadmap
    }

    /**
     * Permanently deletes a skill roadmap from the database.
     * @param {string} id - The ID of the roadmap to remove.
     * @returns {Promise<SkillRoadmap>} The deleted roadmap record.
     */
    delete = async (id: string): Promise<SkillRoadmap> => {
        const skillRoadmap = await prisma.skill_roadmaps.delete({
            where: {
                id
            }
        });

        return skillRoadmap;
    }
}

export { SkillRoadmapRepository };