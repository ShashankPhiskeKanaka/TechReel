import { errorMessage } from "../constants/error.messages.js";
import type { ChallengeSubmissionRepository } from "../repository/challengeSubmission.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class ChallengeSubmissionService {
    constructor (private ChallengeSubmissionMethods: ChallengeSubmissionRepository) {}

    submit = async (data: any, client: any) => {
        const challengeData = await this.ChallengeSubmissionMethods.submit(data, client);

        return challengeData;
    }

    fetchById = async (id: string) => {
        const challengeData = await this.ChallengeSubmissionMethods.fetch(id);

        if(!challengeData.id) {
            logger.warn("No challenge submission found", {
                challengeSubmissionId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Challenge submission data fetched", {
            challengeSubmissionId: id
        });

        return challengeData;
    }
}

export { ChallengeSubmissionService }