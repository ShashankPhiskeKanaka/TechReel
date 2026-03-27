import { prisma } from "../db/prisma.js"
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { Skill, SkillData } from "../dto/skill.dto.js"
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class SkillRepository extends BaseRepository<Skill, SkillData, any> {

    constructor() {
        super(prisma.skills, "Skills");
    }

    // /**
    //  * Creates a new skill record.
    //  * @param {SkillData} data - The skill data to persist.
    //  * @returns {Promise<Skill>} The newly created skill.
    //  */
    // create = async (data: SkillData): Promise<Skill> => {
    //     const skill = await prisma.skills.create({
    //         data
    //     });

    //     return skill;
    // }


    // /**
    //  * Retrieves a single active skill by its ID.
    //  * @param {string} id - The unique identifier of the skill.
    //  * @returns {Promise<Skill>} The skill object, or an empty object if not found.
    //  */
    // fetch = async (id: string): Promise<Skill> => {
    //     const skill = await prisma.skills.findUnique({
    //         where: {
    //             id,
    //             deleted_at: null
    //         }
    //     });

    //     return skill ?? <Skill>{};
    // }

    // /**
    //   * Retrieves a paginated list of skills based on filters.
    //   * @param {PaginationData} data - Pagination settings (limit, cursor, sort).
    //   * @param {Object} filters - Key-value pairs to filter the results.
    //   * @returns {Promise<Skill[]>} A list of skills matching the criteria.
    //   */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]) : Promise<Skill[]> => {

    //     let where: any = {
    //         deletedAt: null,
    //         AND: []
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const skills = await prisma.skills.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' },
    //             { id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return skills;
    // }

    // /**
    //  * Updates an existing active skill.
    //  * @param {SkillData} data - The updated data fields.
    //  * @param {string} id - The ID of the skill to update.
    //  * @returns {Promise<Skill>} The updated skill record.
    //  */
    // update = async (data: SkillData, id: string): Promise<Skill> => {
    //     const skill = await prisma.skills.update({
    //         where: {
    //             id,
    //             deleted_at: null
    //         },
    //         data
    //     });

    //     return skill;
    // }


    // /**
    //  * Marks a skill as deleted without removing it from the database.
    //  * @param {string} id - The ID of the skill to soft delete.
    //  * @returns {Promise<Skill>} The updated skill record with a deletion timestamp.
    //  */
    // softDelete = async (id: string): Promise<Skill> => {
    //     const skill = await prisma.skills.update({
    //         where: {
    //             id,
    //             deleted_at: null
    //         },
    //         data: {
    //             deleted_at: new Date()
    //         }
    //     });

    //     return skill;
    // }

    // /**
    //  * Permanently removes a skill record from the database.
    //  * @param {string} id - The ID of the skill to delete.
    //  * @returns {Promise<Skill>} The deleted skill record.
    //  */
    // hardDelete = async (id: string): Promise<Skill> => {
    //     const skill = await prisma.skills.delete({
    //         where: {
    //             id
    //         }
    //     });

    //     return skill;
    // }
}

export { SkillRepository }