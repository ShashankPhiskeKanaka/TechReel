import { errorMessage } from "../constants/error.messages.js";
import type { ChallengeOptionData } from "../dto/challenge.dto.js";
import type { ChallengeOptionsRepository } from "../repository/challengeOptions.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class ChallengeOptionService {
    constructor ( private ChallengeOptionMethods: ChallengeOptionsRepository ) {}

    /**
     * Orchestrates the update of a specific challenge option.
     * 
     * @param {ChallengeOptionData} data - The partial data to update (option text or correctness).
     * @param {string} id - The unique identifier of the challenge option.
     * @returns {Promise<ChallengeOption>} The updated option record.
     * @throws {ServerError} If the repository update fails or constraints are violated.
     */
    update = async (data: ChallengeOptionData, id: string) => {
        const challengeOption = await this.ChallengeOptionMethods.update(data, id);

        logger.info("Challenge option updated", {
            challengeOptionId: id
        });

        return challengeOption;
    }

    /**
     * Retrieves a single challenge option and validates its existence.
     * 
     * @param {string} id - The unique identifier of the challenge option.
     * @returns {Promise<ChallengeOption>} The found challenge option record.
     * @throws {ServerError} 404 (Not Found) if no option matches the provided ID.
     */
    fetch = async (id: string) => {
        const challengeOption = await this.ChallengeOptionMethods.fetch(id);

        if(!challengeOption.id) {
            logger.warn("No challenge option found with the id", {
                challengeOptionId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }
    }
}

export { ChallengeOptionService }