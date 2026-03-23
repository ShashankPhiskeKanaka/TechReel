import { prisma } from "../db/prisma.js";
import type { Challenge, ChallengeData } from "../dto/challenge.dto.js";

class ChallengeRepository {
    create = async (data: ChallengeData): Promise<Challenge> => {
        const challenge = await prisma.challenges.create({
            data: data
        });

        return challenge;
    }

    find = async (id: string): Promise<Challenge> => {
        const challenge = await prisma.challenges.findFirst({
            where: {
                id
            }
        });

        return challenge ?? <Challenge>{}; 
    }

    update = async (data: any, id: string): Promise<Challenge> => {
        const challenge = await prisma.challenges.update({
            where: {
                id,
                deleted_at: null
            },
            data: data
        });

        return challenge;
    }

    softDelete = async (id: string): Promise<Challenge> => {
        const challenge = await prisma.challenges.update({
            where: {
                id,
                deleted_at: null
            },
            data: {
                deleted_at: new Date()
            }
        });

        return challenge;
    }

    hardDelete = async (id: string): Promise<Challenge> => {
        const challenge = await prisma.challenges.delete({
            where: {
                id,
                deleted_at: null
            }
        });

        return challenge;
    }
}

export { ChallengeRepository }