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
import { UserCertificateService } from "../../src/service/userCertificate.service.js";
import { UserCertificateRepository } from "../../src/repository/userCertificate.repository.js";

const challengeSubmissionService = ControllerFactory.createService(ChallengeSubmissionRepository, ChallengeSubmissionService);
const xpService = ControllerFactory.createService(XpRepository, XpService);
const userRoadmapStepService = ControllerFactory.createService(UserRoadmapStepRepository, UserRoadmapStepService);
const userBadgeService = ControllerFactory.createService(UserBadgesRepository, UserBadgeService);
const tokenLedgerService = ControllerFactory.createService(TokenLedgerRepository, TokenLedgerService);
const userCertificateService = ControllerFactory.createService(UserCertificateService, UserCertificateRepository);

/**
 * Encapsulated Logic to allow for easier Unit Testing
 */
const processGamificationJob = async (job: Job) => {
    const { data } = job.data;

    try {
        return await prisma.$transaction(async (tx) => {
            // Initialize scoped services
            const challengeTx = challengeSubmissionService.tx(tx);
            const roadmapTx = userRoadmapStepService.tx(tx);
            const badgeTx = userBadgeService.tx(tx);
            const tokenTx = tokenLedgerService.tx(tx);
            const xpTx = xpService.tx(tx);
            const certificateTx = userCertificateService.tx(tx);

            // Initial Submission
            const challenge = await challengeTx.submit(data, tx);

            if (!challenge.id) {
                logger.warn("Challenge submission chances exhausted", {
                    userId: data.userId,
                    challengeId: data.challengeId
                });
                throw new serverError(errorMessage.EXHAUSTED);
            }

            // Score Accumulators
            let xpScore = challenge.score;
            let tokensToAward = challenge.score === 10 ? 1 : 0;

            // Roadmap & Badge Logic
            if (data.roadmapStepId) {
                const { currentStep, highestStep } = await roadmapTx.createUserRoadmapStep({
                    userId: data.userId,
                    roadmapStepId: data.roadmapStepId,
                    stepOrder: data.stepOrder
                }, tx);

                // User progressed to a new highest step
                if (highestStep?.stepOrder === currentStep.stepOrder) {
                    const badge = await badgeTx.awardBadge({
                        userId: data.userId,
                        skillId: currentStep.roadmap.skillId
                    }, tx);
                    xpScore += badge.xpReward;
                    tokensToAward += 1;

                    // Certificate Logic
                    if (currentStep.roadmap.difficulty === "PROFICIENT") {
                        await certificateTx.create({
                            skillId: currentStep.roadmap.skillId,
                            userId: data.userId
                        });
                    }
                }

                // Execute Token Awarding if applicable
                if (tokensToAward > 0) {
                    await tokenTx.awardToken({
                        userId: data.userId,
                        amount: tokensToAward,
                        source: challenge.score === 10 ? "CHALLENGE_SUBMISSION" : "ROADMAP_COMPLETED",
                        type: "CREDIT",
                        tokenId: currentStep?.roadmap.tokenId ?? "NA"
                    }, tx);
                }
            }

            // XP Awarding
            await xpTx.awardXp({
                userId: data.userId,
                amount: Math.max(0, xpScore),
                source: "CHALLENGE_SUBMISSION",
                type: xpScore < 0 ? "DEBIT" : "CREDIT"
            }, tx);

            // Cache Invalidation
            await Promise.all([
                redisUtils.invalidateKey(data.userId, Resource.USER, "UPDATE"),
                redisUtils.invalidateKey(data.userId, Resource.USER_PROFILE, "UPDATE")
            ]);

            await redisUtils.sendNotification(data.userId, {
                message: "Challenge processed",
                awardedXp: xpScore,
                tokenAwarded: tokensToAward
            });

        });
    } catch (err: any) {
        logger.error("Gamification job transaction failed", { error: err.message, data })
        throw new serverError(err);

    }
};

/**
 * Worker Definition
 */
export const gamificationWorker = new Worker("GAMIFICATION", processGamificationJob, {
    connection: redisConfig,
    concurrency: 10,
    // Ensure jobs are cleaned up to prevent Redis bloat
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 }
});

gamificationWorker.on("failed", (job, err) => {
    logger.warn(`Job ${job?.id} failed: ${err.message}`);
});
