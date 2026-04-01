import { Worker, type Job } from "bullmq";
import { serverError } from "../../src/utils/error.utils.js";
import { prisma } from "../../db/prisma.js";
import { logger } from "../../src/utils/logger.js";
import { errorMessage } from "../../src/constants/error.messages.js";
import { ChallengeSubmissionRepository } from "../../src/repository/challengeSubmission.repository.js";
import { XpRepository } from "../../src/repository/xp.repository.js";
import { TokenLedgerRepository } from "../../src/repository/tokenLedger.repository.js";
import { UserBadgesRepository } from "../../src/repository/userBadge.repository.js";
import { ControllerFactory } from "../../src/factory/general.factory.js";
import { XpService } from "../../src/service/xp.service.js";
import { UserRoadmapStepRepository } from "../../src/repository/userRoadmapStep.repository.js";
import { UserRoadmapStepService } from "../../src/service/userRoadmapStep.service.js";
import { UserBadgeService } from "../../src/service/userBadge.service.js";
import { TokenLedgerService } from "../../src/service/tokenLedger.service.js";
import { ChallengeSubmissionService } from "../../src/service/challengeSubmission.service.js";
import { redisConfig } from "../../src/config/redis.config.js";
import { redisUtils } from "../../src/utils/redis.utils.js";
import { Resource } from "../../src/dto/redis.dto.js";

const challengeSubmissionService = ControllerFactory.createService(ChallengeSubmissionRepository, ChallengeSubmissionService);
const xpService = ControllerFactory.createService(XpRepository, XpService);
const userRoadmapStepService = ControllerFactory.createService(UserRoadmapStepRepository, UserRoadmapStepService);
const userBadgeService = ControllerFactory.createService(UserBadgesRepository, UserBadgeService);
const tokenLedgerService = ControllerFactory.createService(TokenLedgerRepository, TokenLedgerService);

const gamificationWorker = new Worker("GAMIFICATION", async (job: Job) => {
    const { data } = job.data;

    try {
        return await prisma.$transaction(async (tx) => {
            const challengeData = await challengeSubmissionService.submit(data, tx);

            if (!challengeData.id) {
                logger.warn("Challenge submission chances exhausted", {
                    userId: data.userId,
                    challengeId: data.challengeId
                });

                throw new serverError(errorMessage.EXHAUSTED);
            }

            let xpScore = challengeData.score;

            if (challengeData.score == 10 && data.roadmapStepId) {
                let amount = 1;

                const { currentStep, highestStep } = await userRoadmapStepService.createUserRoadmapStep({
                    userId: data.userId,
                    roadmapStepId: data.roadmapStepId,
                    stepOrder: data.stepOrder
                }, tx)

                if (highestStep?.stepOrder == currentStep.stepOrder) {
                    const badge = await userBadgeService.awardBadge({
                        userId: data.userId,
                        skillId: currentStep.roadmap.skillId
                    }, tx)

                    xpScore += badge.xpReward

                    amount++;
                }

                await tokenLedgerService.awardToken({
                    userId: data.userId,
                    amount,
                    source: "CHALLENGE_SUBMISSION",
                    type: "CREDIT",
                    tokenId: currentStep?.roadmap.tokenId ?? "NA"
                }, tx)

            } else if (data.roadmapStepId) {
                const { currentStep, highestStep } = await userRoadmapStepService.createUserRoadmapStep({
                    userId: data.userId,
                    roadmapStepId: data.roadmapStepId,
                    stepOrder: data.stepOrder
                }, tx)

                if (highestStep?.stepOrder == currentStep.stepOrder) {
                    const badge = await userBadgeService.awardBadge({
                        userId: data.userId,
                        skillId: currentStep.roadmap.skillId
                    }, tx)

                    xpScore += badge.xpReward;

                    await tokenLedgerService.awardToken({
                        userId: data.userId,
                        amount: 1,
                        source: "ROADMAP_COMPLETED",
                        type: "CREDIT",
                        tokenId: currentStep?.roadmap.tokenId ?? "NA"
                    }, tx)
                }
            }

            await xpService.awardXp({
                userId: data.userId,
                amount: xpScore < 0 ? 0 : xpScore,
                source: "CHALLENGE_SUBMISSION",
                type: xpScore < 0 ? "DEBIT" : "CREDIT"
            }, tx);

            await redisUtils.invalidateKey(data.userId, Resource.USER, "UPDATE");
            await redisUtils.invalidateKey(data.userId, Resource.USER_PROFILE, "UPDATE");
        })
    } catch (err: any) {
        throw new serverError(err);
    }
}, {
    connection: redisConfig,
    concurrency: 10
})

gamificationWorker.on("failed", (job: any, err) => {
    logger.warn(`Job ${job.id} failed: ${err.message}`);
});

export { gamificationWorker }