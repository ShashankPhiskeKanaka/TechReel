import { errorMessage } from "../constants/error.messages.js";
import type { ChallengeData } from "../dto/challenge.dto.js";
import type { ChallengeRepository } from "../repository/challenge.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class ChallengeService {
    constructor (private ChallengeMethods: ChallengeRepository) {}

    create = async (data: ChallengeData) => {
        const challenge = await this.ChallengeMethods.create(data);

        logger.info("New challenge created", {
            challengeId: challenge.id
        });

        return challenge;
    }

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

    fetchByReel = async (reelId: string) => {
        const challenges = await this.ChallengeMethods.findByReel(reelId);

        if(challenges.length = 0){
            logger.warn("No challenges with the provided reelId found", {
                reelId
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Challenges fetched by reelId", {
            reelId
        });

        return challenges;
    }   
    
    update = async (data: any, id: string) => {
        const challenge = await this.ChallengeMethods.update(data, id);

        logger.info("Challenge updated", {
            challengeId: id
        });

        return challenge;
    }

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