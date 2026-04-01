import type { SkillRoadmap, SkillRoadmapData } from "../dto/skillRoadmap.dto.js";
import type { SkillRoadmapRepository } from "../repository/skillRoadmap.repository.js";
import { BaseService } from "./base.service.js";

class SkillRoadmapService extends BaseService<SkillRoadmap, SkillRoadmapData, any> {
    constructor(methods: SkillRoadmapRepository) {
        super(methods, "SKILL-ROADMAP");
    }

    // /**
    //  * Creates a new skill roadmap and logs the generated ID.
    //  * @param {SkillRoadmapData} data - The roadmap configuration data.
    //  * @returns {Promise<SkillRoadmap>} The created skill roadmap record.
    //  */
    // create = async (data: SkillRoadmapData) => {
    //     const skillRoadmap = await this.SkillRoadmapMethods.create(data);

    //     logger.info("Skill roadmap created", {
    //         skillRoadmapId: skillRoadmap.id
    //     });

    //     return skillRoadmap;
    // }

    // /**
    //  * Retrieves a skill roadmap by ID and validates its existence.
    //  * @param {string} id - The unique identifier of the roadmap.
    //  * @returns {Promise<void>}
    //  * @throws {serverError} NOTFOUND if no record matches the provided ID.
    //  */
    // fetch = async (id: string) => {
    //     const skillRoadmap = await this.SkillRoadmapMethods.fetch(id);

    //     if(skillRoadmap.id) {
    //         logger.warn("No skill roadmap record found for id", {
    //             skillRoadmapId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }
    // }

    // /**
    //  * Fetches a paginated list of skill roadmaps and ensures the result set is not empty.
    //  * @param {PaginationData} data - Pagination and sorting parameters.
    //  * @param {Object} filters - Filtering criteria for the roadmaps.
    //  * @returns {Promise<SkillRoadmap[]>} A list of skill roadmaps.
    //  * @throws {serverError} NOTFOUND if the resulting list is empty.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}) => {
    //     const skillRoadmaps = await this.SkillRoadmapMethods.fetchAll(data, filters);

    //     if(skillRoadmaps.length == 0) {
    //         logger.warn("No skill roadmap data found");

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info("Skill roadmaps fetched");

    //     return skillRoadmaps;
    // }

    // /**
    //  * Updates an existing skill roadmap and logs the update operation.
    //  * @param {any} data - The updated fields for the roadmap.
    //  * @param {string} skillRoadmapId - The ID of the roadmap to update.
    //  * @returns {Promise<SkillRoadmap>} The updated roadmap record.
    //  */
    // update = async (data: any, skillRoadmapId: string) => {
    //     const skillRoadmap = await this.SkillRoadmapMethods.update(data, skillRoadmapId);

    //     logger.info("Skill roadmap updated with the id", {
    //         skillRoadmapId
    //     });

    //     return skillRoadmap;
    // }

    // /**
    //  * Permanently deletes a skill roadmap and logs the deletion.
    //  * @param {string} skillRoadmapId - The ID of the roadmap to remove.
    //  * @returns {Promise<SkillRoadmap>} The deleted roadmap record.
    //  */
    // delete = async (skillRoadmapId: string) => {
    //     const skillRoadmap = await this.SkillRoadmapMethods.delete(skillRoadmapId);

    //     logger.info("Skill roadmap deleted with the id", {
    //         skillRoadmapId
    //     });

    //     return skillRoadmap;
    // }
}

export { SkillRoadmapService }