import type { PaginationData } from "../dto/pagination.dto.js";
import type { SkillData, Skill } from "../dto/skill.dto.js";
import type { SkillRepository } from "../repository/skill.repository.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";

class SkillService extends BaseService<Skill, SkillData, any> {
    constructor(methods: SkillRepository) {
        super(methods, "SKILL");
    }

    // /**
    //  * Persists new skill metadata and returns the created record.
    //  * 
    //  * @param {SkillData} data - The skill payload (name, category, etc.).
    //  * @returns {Promise<skills>} The created skill record.
    //  */

    // create = async (data: SkillData) => {
    //     const skill = await this.SkillMethods.create(data);

    //     logger.info("New skill created", {
    //         skillId: skill.id
    //     });

    //     return skill;
    // }

    // /**
    //  * Retrieves a specific skill by its ID.
    //  * 
    //  * @param {string} id - The unique Skill ID.
    //  * @returns {Promise<skills>} The found skill record.
    //  * @throws {ServerError} 404 if the record is missing or soft-deleted.
    //  */

    // fetch = async (id: string) => {
    //     const skill = await this.SkillMethods.fetch(id);

    //     logger.info("Skill fetched", {
    //         skillId: skill.id
    //     });

    //     return skill;
    // }

    // fetchAll = async (data: PaginationData, filters: {}) => {
    //     const skills = await this.SkillMethods.fetchAll(data, filters);

    //     logger.info("Skills fetched");

    //     return skills;
    // }

    // /**
    //  * Updates an existing skill's metadata
    //  * 
    //  * @param {SkillData} data - Partial or full skill metadata to update.
    //  * @param {string} id - The unique identifier of the skill.
    //  * @returns {Promise<skills>} The updated skill record.
    //  * @throws {ServerError} 404 if the skill does not exist or is soft-deleted.
    //  */
    // update = async (data: SkillData, id: string) => {
    //     const skill = await this.SkillMethods.update(data, id);

    //     logger.info("Skill updated", {
    //         skillId: skill.id
    //     });

    //     return skill;
    // }

    // /**
    //  * Removes a skill record using the specified deletion strategy.
    //  * 
    //  * @param {string} id - The unique Skill ID.
    //  * @param {boolean} flag - True for permanent removal (hard), false for soft delete.
    //  * @returns {Promise<skills>} The result of the deletion.
    //  */

    // delete = async (id: string, flag: boolean) => {
    //     let skill;
    //     if (flag) {
    //         skill = await this.SkillMethods.hardDelete(id);
    //         logger.info("Skill hard deleted", {
    //             skillId: id
    //         });
    //     } else {
    //         skill = await this.SkillMethods.softDelete(id);
    //         logger.info("Skill soft deleted", {
    //             skillId: id
    //         });
    //     }

    //     return skill;
    // }
}

export { SkillService };