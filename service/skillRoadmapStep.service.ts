import type { SkillRoadmapStep, SkillRoadmapStepData } from "../dto/skillRoadmapStep.dto.js";
import type { SkillRoadmapStepRepository } from "../repository/skillRoadmapStep.repository.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";

class SkillRoadmapStepService extends BaseService<SkillRoadmapStep, SkillRoadmapStepData, any> {

    constructor (methods: SkillRoadmapStepRepository) {
        super(methods, "Skill roadmap step");
    }

    // create = async (data: SkillRoadmapStepData) => {
    //     const skillRoadmapStep = await this.SkillRoadmapStepMethods.create(data)

    //     logger.info("Skill roadmap step created", {
    //         skillRoadmapStepId: skillRoadmapStep.id
    //     });

    //     return skillRoadmapStep;
    // }

    // fetch = async (id: string) => {
    //     const skillRoadmapStep = await this.SkillRoadmapStepMethods.fetch(id);
    // }
}

export { SkillRoadmapStepService };