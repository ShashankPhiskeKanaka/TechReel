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
        const challenge = await prisma.challenge_options.findFirst({
            where: {
                id
            }
        });

        return challenge ?? <ChallengeOption>{};
    }
}

export { ChallengeOptionsRepository }