import type { Challenge, ChallengeData } from "../dto/challenge.dto.js";
import type { ChallengeRepository } from "../repository/challenge.repository.js";
import { BaseService } from "./base.service.js";

class ChallengeService extends BaseService<Challenge, ChallengeData, any> {
    constructor(methods: ChallengeRepository) {
        super(methods, "Challenge")
    }

    // /**
    //  * Orchestrates the creation of a new challenge and its associated options.
    //  * 
    //  * @param {ChallengeData} data - The validated challenge payload from the controller.
    //  * @returns {Promise<Challenge>} The successfully persisted challenge record.
    //  * @throws {Error} If the repository operation fails or data is inconsistent.
    //  */
    // create = async (data: ChallengeData) => {
    //     const challenge = await this.ChallengeMethods.create(data);

    //     logger.info("New challenge created", {
    //         challengeId: challenge.id
    //     });

    //     await redisUtils.invalidateKey("PUBLIC", Resource.CHALLENGE, Action.CREATE );

    //     return challenge;
    // }

    // /**
    //  * Retrieves a challenge by its ID and validates its existence.
    //  * 
    //  * @param {string} id - The unique identifier of the challenge.
    //  * @returns {Promise<Challenge>} The found challenge record.
    //  * @throws {ServerError} 404 (Not Found) if no active challenge matches the ID.
    //  */
    // fetch = async (id: string) => {
    //     const challenge = await this.ChallengeMethods.fetch(id);

    //     if(!challenge.id){
    //         logger.warn("No challenge with the provided id found", {
    //             challengeId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info("Challenge fetched by id", {
    //         challengeId: id
    //     });

    //     return challenge;
    // }

    // fetchAll = async (data: PaginationData, filters: {}) => {
    //     const challenges = await this.ChallengeMethods.fetchAll(data, filters);

    //     logger.info("Challenges fetched")

    //     return challenges;
    // }

    // /**
    //  * Updates an existing challenge's details and validates the operation.
    //  * 
    //  * @param {any} data - The partial data object containing fields to be updated.
    //  * @param {string} id - The unique identifier of the challenge.
    //  * @returns {Promise<Challenge>} The updated challenge record.
    //  * @throws {ServerError} 404 (Not Found) if the challenge does not exist or is deleted.
    //  */
    // update = async (data: any, id: string) => {
    //     const challenge = await this.ChallengeMethods.update(data, id);

    //     logger.info("Challenge updated", {
    //         challengeId: id
    //     });

    //     await redisUtils.invalidateKey("PUBLIC", Resource.CHALLENGE, Action.UPDATE);

    //     return challenge;
    // }

    // /**
    //  * Handles the removal of a challenge record using either soft or hard deletion.
    //  * 
    //  * @param {boolean} flag - If true, performs a permanent hard delete; otherwise, performs a soft delete.
    //  * @param {string} id - The unique identifier of the challenge to remove.
    //  * @returns {Promise<Challenge>} The deleted challenge record data.
    //  * @throws {ServerError} 404 (Not Found) if the challenge does not exist or is already deleted.
    //  */

    // delete = async (flag: boolean, id: string) => {
    //     let challenge;
    //     if(flag) {
    //         challenge = await this.ChallengeMethods.hardDelete(id);
    //         logger.info("Challenge hard deleted", {
    //             challengeId: id
    //         });
    //     }else {
    //         challenge = await this.ChallengeMethods.softDelete(id);
    //         logger.info("Challenge soft deleted", {
    //             challengeId: id
    //         });
    //     }

    //     await redisUtils.invalidateKey("PUBLIC", Resource.CHALLENGE, Action.DELETE);

    //     return challenge;
    // }
}

export { ChallengeService }