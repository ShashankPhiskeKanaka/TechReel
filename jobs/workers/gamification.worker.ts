import { Worker, type Job } from "bullmq";
import { serverError } from "../../utils/error.utils.js";
import { prisma } from "../../db/prisma.js";
import { logger } from "../../utils/logger.js";
import { errorMessage } from "../../constants/error.messages.js";
import { ChallengeSubmissionRepository } from "../../repository/challengeSubmission.repository.js";
import { XpRepository } from "../../repository/xp.repository.js";
import { TokenLedgerRepository } from "../../repository/tokenLedger.repository.js";
import { UserBadgesRepository } from "../../repository/userBadge.repository.js";
import { ControllerFactory } from "../../factory/general.factory.js";
import { XpService } from "../../service/xp.service.js";
import { UserRoadmapStepRepository } from "../../repository/userRoadmapStep.repository.js";
import { UserRoadmapStepService } from "../../service/userRoadmapStep.service.js";
import { UserBadgeService } from "../../service/userBadge.service.js";
import { TokenLedgerService } from "../../service/tokenLedger.service.js";
import { ChallengeSubmissionService } from "../../service/challengeSubmission.service.js";
import { redisConfig } from "../../config/redis.config.js";

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

            }

            await xpService.awardXp({
                userId: data.userId,
                amount: challengeData.score,
                source: "CHALLENGE_SUBMISSION",
                type: xpScore < 0 ? "DEBIT" : "CREDIT"
            }, tx);
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