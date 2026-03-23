import { prisma } from "../db/prisma.js";
import type { ChallengeSubmissionData, ChallengeSubmission } from "../dto/challenge.dto.js";

class ChallengeSubmissionRepository {
    create = async (data: ChallengeSubmissionData): Promise<ChallengeSubmission> => {
        const challengeSubmission = await prisma.challenge_submissions.create({
            data: data
        });

        return challengeSubmission;
    }

    fetch = async (id: string): Promise<ChallengeSubmission> => {
        const challengeSubmission = await prisma.challenge_submissions.findFirst({
            where: {
                id
            }
        });

        return challengeSubmission ?? <ChallengeSubmission>{};
    }

    delete = async (id: string): Promise<ChallengeSubmission> => {
        const challengeSubmission = await prisma.challenge_submissions.delete({
            where: {
                id
            }
        });

        return challengeSubmission;
    }


}