import { prisma } from "../db/prisma.js";
import type { Challenge, ChallengeData } from "../dto/challenge.dto.js";
import { challenge_type } from "../generated/prisma/enums.js";

class ChallengeRepository {
    create = async (data: ChallengeData): Promise<Challenge> => {
        const { options, ...challengeData } = data;

        const createInput: any = { ...challengeData };

        if (data.challengeType === challenge_type.MCQ && options) {
            createInput.challengeOptions = {
                create: options.map((opt: any) => ({
                    isCorrect: opt.isCorrect,
                    option: opt.option
                }))
            };
        }

        return await prisma.challenges.create({
            data: createInput,
            include: {
                challengeOptions: true
            }
        });
    }

    find = async (id: string) => {
        const challenge = await prisma.challenges.findFirst({
            where: {
                id
            },
            include: {
                challengeOptions: true
            }
        });

        return challenge ?? <Challenge>{}; 
    }

    findByReel = async (reelId: string) => {
        const challenge = await prisma.challenges.findMany({
            where: {
                reelId
            },
            include: {
                challengeOptions : true
            }
        });

        return challenge ?? [];
    }

    update = async (data: any, id: string): Promise<Challenge> => {
        const challenge = await prisma.challenges.update({
            where: {
                id,
                deletedAt: null
            },
            data: data
        });

        return challenge;
    }

    softDelete = async (id: string): Promise<Challenge> => {
        const challenge = await prisma.challenges.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        return challenge;
    }

    hardDelete = async (id: string): Promise<Challenge> => {
        const challenge = await prisma.challenges.delete({
            where: {
                id,
                deletedAt: null
            }
        });

        return challenge;
    }
}

export { ChallengeRepository }