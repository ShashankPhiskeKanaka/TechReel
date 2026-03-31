import { errorMessage } from "../constants/error.messages.js";
import type { ChallengeOptionData, ChallengeOption } from "../dto/challengeOption.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { Resource } from "../dto/redis.dto.js";
import type { ChallengeOptionsRepository } from "../repository/challengeOption.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";
import { BaseService } from "./base.service.js";

class ChallengeOptionService extends BaseService<ChallengeOption, ChallengeOptionData, any> {
    constructor(methods: ChallengeOptionsRepository) {
        super(methods, "Challenge options");
    }

    // /**
    //  * Orchestrates the update of a specific challenge option.
    //  * 
    //  * @param {ChallengeOptionData} data - The partial data to update (option text or correctness).
    //  * @param {string} id - The unique identifier of the challenge option.
    //  * @returns {Promise<ChallengeOption>} The updated option record.
    //  * @throws {ServerError} If the repository update fails or constraints are violated.
    //  */
    // update = async (data: ChallengeOptionData, id: string) => {
    //     const challengeOption = await this.ChallengeOptionMethods.update(data, id);

    //     logger.info("Challenge option updated", {
    //         challengeOptionId: id
    //     });

    //     await redisUtils.invalidateKey("PUBLIC", Resource.CHALLENGE, "UPDATE");

    //     return challengeOption;
    // }

    // /**
    //  * Retrieves a single challenge option and validates its existence.
    //  * 
    //  * @param {string} id - The unique identifier of the challenge option.
    //  * @returns {Promise<ChallengeOption>} The found challenge option record.
    //  * @throws {ServerError} 404 (Not Found) if no option matches the provided ID.
    //  */
    // fetch = async (id: string) => {
    //     const challengeOption = await this.ChallengeOptionMethods.fetch(id);

    //     if(!challengeOption.id) {
    //         logger.warn("No challenge option found with the id", {
    //             challengeOptionId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }
    // }

    /**
     * Retrieves all options associated with a specific challenge and logs the operation.
     * @param {string} challengeId - The unique identifier of the challenge.
     * @returns {Promise<ChallengeOption[]>} A list of options belonging to the challenge.
     */
    fetchAllOptions = async (challengeId: string) => {
        const challengeOptions = await this.methods.fetchAllOptions(challengeId);

        logger.info("Challenge options fetched for challengeId", {
            challengeId
        });

        return challengeOptions;
    }
}

export { ChallengeOptionService }