import { prisma } from "../db/prisma.js"
import type { ChallengeOptionData, ChallengeOption } from "../dto/challenge.dto.js"

class ChallengeOptionsRepository {

    /**
     * Updates an existing challenge option record in the database.
     * 
     * @param {ChallengeOptionData} data - The partial data to be updated.
     * @param {string} id - The unique ID (UUID) of the challenge option.
     * @returns {Promise<ChallengeOption>} The updated challenge option record.
     * @throws {PrismaClientKnownRequestError} If the record is not found (P2025).
     */
    update = async (data: ChallengeOptionData, id: string) : Promise<ChallengeOption> => {
        const challenge = await prisma.challenge_options.update({
            where: {
                id
            },
            data: data
        });

        return challenge;
    }

    /**
     * Retrieves a single challenge option by its unique identifier.
     * 
     * @param {string} id - The unique ID (UUID) of the challenge option.
     * @returns {Promise<ChallengeOption>} The found challenge option or an empty object if not found.
     * @note Uses findFirst for the primary key lookup.
     */
    fetch = async (id: string): Promise<ChallengeOption> => {
        const challengeOption = await prisma.challenge_options.findFirst({
            where: {
                id
            }
        });

        return challengeOption ?? <ChallengeOption>{};
    }

    /**
     * Retrieves all options associated with a specific challenge.
     * @param {string} challengeId - The unique identifier of the challenge.
     * @returns {Promise<ChallengeOption[]>} A list of options belonging to the challenge.
     */
    fetchAll = async (challengeId: string): Promise<ChallengeOption[]> => {
        const challengeOptions = await prisma.challenge_options.findMany({
            where: {
                challengeId
            }
        });

        return challengeOptions
    }

}

export { ChallengeOptionsRepository }