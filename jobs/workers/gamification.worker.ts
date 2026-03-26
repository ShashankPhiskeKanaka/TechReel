import { Worker, type Job } from "bullmq";
import { serverError } from "../../utils/error.utils.js";
import { prisma } from "../../db/prisma.js";
import { logger } from "../../utils/logger.js";
import { errorMessage } from "../../constants/error.messages.js";
import { ChallengeService } from "../../service/challenge.service.js";
import { ChallengeSubmissionRepository } from "../../repository/challengeSubmission.repository.js";
import { GamificationService } from "../../service/gamification.service.js";
import { XpRepository } from "../../repository/xp.repository.js";
import { TokenRepository } from "../../repository/token.repository.js";
import { TokenLedgerRepository } from "../../repository/tokenLedger.repository.js";
import { UserRoadmapStepsRepository } from "../../repository/userRoadmapStep.repository.js";
import { UserBadgesRepository } from "../../repository/userBadge.repository.js";
import { GamificationFactory } from "../../factory/gamification.factory.js";
import { ControllerFactory } from "../../factory/general.factory.js";

const gamificationService = GamificationFactory.createService(ChallengeSubmissionRepository, XpRepository, TokenLedgerRepository, UserRoadmapStepsRepository, UserBadgesRepository, GamificationService)
const ChallengeService = ControllerFactory.createService(ChallengeS)

const gamificationWorker = new Worker("GAMIFICATION", async (job: Job) => {
    const { data } = job.data;

    try {
        return await prisma.$transaction(async (tx) => {
            const challengeData = await gamificationService.submitChallenge(data, tx);

            if (!challengeData) {
                logger.warn("Challenge submission chances exhausted", {
                    userId: data.userId,
                    challengeId: data.challengeId
                });

                throw new serverError(errorMessage.EXHAUSTED);
            }

            await gamificationService.awardXp({
                userId: data.userId,
                amount: challengeData.score,
                source: "CHALLENGE_SUBMISSION",
                type: challengeData.score < 0 ? "DEBIT" : "CREDIT"
            }, tx);



            if (challengeData.score == 10 && data.roadmapStepId) {
                let amount = 1;

                const { currentStep, highestStep } = await gamificationService.createUserRoadmapStep({
                    userId: data.userId,
                    roadmapStepId: data.roadmapStepId
                }, tx)

                if (highestStep?.stepOrder == currentStep.stepOrder) {
                    await gamificationService.awardBadge({
                        userId: data.userId,
                        skillId: currentStep.roadmap.skillId
                    }, tx)

                    amount++;
                }

                await gamificationService.awardToken({
                    userId: data.userId,
                    amount,
                    source: "CHALLENGE_SUBMISSION",
                    type: "CREDIT",
                    tokenId: currentStep?.roadmap.tokenId ?? "NA"
                }, tx)

            }
        })
    } catch (err: any) {
        throw new serverError(err);
    }
})

export { gamificationWorker }