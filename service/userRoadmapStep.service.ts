import type { UserRoadmapStepData } from "../dto/userRoadmapStep.dto.js";
import type { UserRoadmapStepRepository } from "../repository/userRoadmapStep.repository.js";

class UserRoadmapStepService {
    constructor (private UserRoadmapStepMethods: UserRoadmapStepRepository) {}

    createUserRoadmapStep = async (data: UserRoadmapStepData, client: any) => {
        const { currentStep, highestStep } = await this.UserRoadmapStepMethods.create(data, client);

        return { currentStep, highestStep }
    }
}

export { UserRoadmapStepService };