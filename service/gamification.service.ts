import type { BadgeData, UserBadgeData } from "../dto/badge.dto.js";
import type { TokenData, TokenLedgerData } from "../dto/token.dto.js";
import type { UserRoadmapStepData } from "../dto/userRoadmapStep.dto.js";
import type { XpData } from "../dto/xp.dto.js";
import type { ChallengeSubmissionRepository } from "../repository/challengeSubmission.repository.js"
import type { TokenLedgerRepository } from "../repository/tokenLedger.repository.js";
import type { UserBadgesRepository } from "../repository/userBadge.repository.js";
import type { UserRoadmapStepsRepository } from "../repository/userRoadmapStep.repository.js";
import type { XpRepository } from "../repository/xp.repository.js";
import { addGamificationTask } from "../jobs/producers/gamification.producer.js";
import type { ChallengeSubmissionData } from "../dto/challenge.dto.js";
import { logger } from "../utils/logger.js";

class GamificationService {

    constructor( private XpMethods: XpRepository, private TokenLedgerMethods: TokenLedgerRepository, private UserRoadmapStepMethods: UserRoadmapStepsRepository, private UserBadgeMethods: UserBadgesRepository) { }

    awardXp = async (data: XpData, client: any) => {
        const xp = await this.XpMethods.awardXp(data, client);

        return xp;
    }

    awardToken = async (data: TokenLedgerData, client: any) => {
        const tokenLedger = await this.TokenLedgerMethods.awardToken(data, client);

        return tokenLedger;
    }

    awardBadge = async (data: UserBadgeData, client: any) => {
        await this.UserBadgeMethods.awardBadge(data, client);

        return;
    }

    createUserRoadmapStep = async (data: UserRoadmapStepData, client: any) => {
        const { currentStep, highestStep } = await this.UserRoadmapStepMethods.create(data, client);

        return { currentStep, highestStep }
    }
}

export { GamificationService }