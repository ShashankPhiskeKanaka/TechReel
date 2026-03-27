import { errorMessage } from "../constants/error.messages.js";
import type { ChallengeSubmissionData, ChallengeSubmission } from "../dto/challengeSubmission.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { addGamificationTask } from "../jobs/producers/gamification.producer.js";
import type { ChallengeSubmissionRepository } from "../repository/challengeSubmission.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";

class ChallengeSubmissionService extends BaseService<ChallengeSubmission, ChallengeSubmissionData, any> {
    constructor (methods: ChallengeSubmissionRepository) {
        super(methods, "Challenge submission")
    }

    /**
     * Dispatches a challenge submission task to the background worker.
     * 
     * @param {ChallengeSubmissionData} data - The payload containing userId, challengeId, and submission details.
     * @returns {Promise<void>} Resolves as soon as the job is successfully stored in Redis.
     */
    createChallengeSubmissionJob = async (data: ChallengeSubmissionData) => {
        await addGamificationTask(data);

        logger.info("Challenge submission job added to queue", {
            userId: data.userId,
            challengeId: data.challengeId
        });

        return;
    }

    submit = async (data: any, client: any) => {
        const challengeData = await this.methods.submit(data, client);

        return challengeData;
    }

    // fetch = async (id: string) => {
    //     const challengeData = await this.ChallengeSubmissionMethods.fetch(id);

    //     if(!challengeData.id) {
    //         logger.warn("No challenge submission found", {
    //             challengeSubmissionId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info("Challenge submission data fetched", {
    //         challengeSubmissionId: id
    //     });

    //     return challengeData;
    // }

    // fetchAll = async (data: PaginationData, filters: {}) => {
    //     const challengeSubmissions = await this.ChallengeSubmissionMethods.fetchAll(data, filters);

    //     logger.info("Challenge submissions fetched");

    //     return challengeSubmissions;
    // }

    // delete = async (challengeSubmissionId: string) => {
    //     const challengeSubmission = await this.ChallengeSubmissionMethods.delete(challengeSubmissionId);

    //     logger.info("Challenge submission deleted", {
    //         challengeSubmissionId
    //     });

    //     return challengeSubmission;
    // }
}

export { ChallengeSubmissionService }