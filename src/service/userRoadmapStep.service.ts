import type { UserRoadmapStepRepository } from "../repository/userRoadmapStep.repository.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";
import type { UserRoadmapStep, UserRoadmapStepData } from "../dto/userRoadmapStep.dto.js";

class UserRoadmapStepService extends BaseService<UserRoadmapStep, UserRoadmapStepData, any> {
    constructor(methods: UserRoadmapStepRepository) {
        super(methods, "USER-ROADMAP-STEP");
    }

    /**
     * Progresses a user along their roadmap by creating or updating a roadmap step.
     * @param data - The roadmap and step details (roadmapId, stepId, status).
     * @param client - The user identifier or session context.
     * @returns An object containing the user's current progress and overall milestone.
     * @throws {Error} If the step record cannot be created or the roadmap is invalid.
     */
    createUserRoadmapStep = async (data: UserRoadmapStepData, client: any) => {
        const { currentStep, highestStep, newUserRoadmapStep } = await this.methods.create(data, client);

        logger.info("New user roadmap step created", {
            userRoadmapStepId: newUserRoadmapStep.id,
            userId: newUserRoadmapStep.userId
        });

        return { currentStep, highestStep }
    }
}

export { UserRoadmapStepService };