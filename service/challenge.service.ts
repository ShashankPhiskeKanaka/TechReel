import { errorMessage } from "../constants/error.messages.js";
import type { ChallengeData } from "../dto/challenge.dto.js";
import type { ChallengeRepository } from "../repository/challenge.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class ChallengeService {
    constructor (private ChallengeMethods: ChallengeRepository) {}

    /**
     * Orchestrates the creation of a new challenge and its associated options.
     * 
     * @param {ChallengeData} data - The validated challenge payload from the controller.
     * @returns {Promise<Challenge>} The successfully persisted challenge record.
     * @throws {Error} If the repository operation fails or data is inconsistent.
     */
    create = async (data: ChallengeData) => {
        const challenge = await this.ChallengeMethods.create(data);

        logger.info("New challenge created", {
            challengeId: challenge.id
        });

        return challenge;
    }

    /**
     * Retrieves a challenge by its ID and validates its existence.
     * 
     * @param {string} id - The unique identifier of the challenge.
     * @returns {Promise<Challenge>} The found challenge record.
     * @throws {ServerError} 404 (Not Found) if no active challenge matches the ID.
     */
    fetch = async (id: string) => {
        const challenge = await this.ChallengeMethods.find(id);

        if(!challenge.id){
            logger.warn("No challenge with the provided id found", {
                challengeId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Challenge fetched by id", {
            challengeId: id
        });

        return challenge;
    }

    /**
     * Retrieves the challenge associated with a specific reel and validates its existence.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<Challenge>} The found challenge record.
     * @throws {ServerError} 404 (Not Found) if no active challenge is linked to the reelId.
     * @note Used to populate the interaction layer of the video player.
     */
    fetchByReel = async (reelId: string) => {
        const challenge = await this.ChallengeMethods.findByReel(reelId);

        if(!challenge?.id){
            logger.warn("No challenges with the provided reelId found", {
                reelId
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Challenges fetched by reelId", {
            reelId
        });

        return challenge;
    }   
    
    /**
     * Updates an existing challenge's details and validates the operation.
     * 
     * @param {any} data - The partial data object containing fields to be updated.
     * @param {string} id - The unique identifier of the challenge.
     * @returns {Promise<Challenge>} The updated challenge record.
     * @throws {ServerError} 404 (Not Found) if the challenge does not exist or is deleted.
     */
    update = async (data: any, id: string) => {
        const challenge = await this.ChallengeMethods.update(data, id);

        logger.info("Challenge updated", {
            challengeId: id
        });

        return challenge;
    }

    /**
     * Handles the removal of a challenge record using either soft or hard deletion.
     * 
     * @param {boolean} flag - If true, performs a permanent hard delete; otherwise, performs a soft delete.
     * @param {string} id - The unique identifier of the challenge to remove.
     * @returns {Promise<Challenge>} The deleted challenge record data.
     * @throws {ServerError} 404 (Not Found) if the challenge does not exist or is already deleted.
     */

    delete = async (flag: boolean, id: string) => {
        let challenge;
        if(flag) {
            challenge = await this.ChallengeMethods.hardDelete(id);
            logger.info("Challenge hard deleted", {
                challengeId: id
            });
        }else {
            challenge = await this.ChallengeMethods.softDelete(id);
            logger.info("Challenge soft deleted", {
                challengeId: id
            });
        }

        return challenge;
    }
}

export { ChallengeService }