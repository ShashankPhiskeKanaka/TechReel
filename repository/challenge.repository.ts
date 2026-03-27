import { prisma } from "../db/prisma.js";
import type { Challenge, ChallengeData } from "../dto/challenge.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { challenge_type } from "../generated/prisma/enums.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class ChallengeRepository extends BaseRepository<Challenge, ChallengeData, any> {

    constructor() {
        super(prisma.challenges, "Challenges");
    }

    // /**
    //  * Retrieves the active challenge associated with a specific reel.
    //  * 
    //  * @param {string} reelId - The unique identifier of the parent reel.
    //  * @returns {Promise<challenges | null>} The challenge record with nested options, or null if not found.
    //  * @note Filters out soft-deleted records and performs an eager load of 'challengeOptions'.
    //  */
    // fetchByReel = async (reelId: string) => {
    //     const challenge = await prisma.challenges.findFirst({
    //         where: {
    //             reelId,
    //             deletedAt: null
    //         },
    //         include: {
    //             challengeOptions: true
    //         }
    //     });

    //     return challenge;
    // }

    // /**
    //  * Creates a challenge and its associated MCQ options as a single atomic unit.
    //  * 
    //  * @param {ChallengeData} data - The challenge metadata, including optional MCQ options.
    //  * @returns {Promise<Challenge>} The created challenge record with nested options included.
    //  * @note Uses Prisma's nested write to ensure options are linked and saved in one transaction.
    //  */
    // create = async (data: ChallengeData): Promise<Challenge> => {
    //     const { options, ...challengeData } = data;

    //     const createInput: any = { ...challengeData };

    //     if (data.challengeType === challenge_type.MCQ && options) {
    //         createInput.challengeOptions = {
    //             create: options.map((opt: any) => ({
    //                 isCorrect: opt.isCorrect,
    //                 option: opt.option
    //             }))
    //         };
    //     }

    //     return await prisma.challenges.create({
    //         data: createInput,
    //         include: {
    //             challengeOptions: true
    //         }
    //     });
    // }

    // /**
    //  * Retrieves a single active challenge by its unique identifier.
    //  * 
    //  * @param {string} id - The unique ID (UUID) of the challenge.
    //  * @returns {Promise<Challenge>} The challenge object with nested MCQ options, or an empty object if not found.
    //  * @note Excludes records where 'deletedAt' is set (soft-delete) and eagerly loads 'challengeOptions'.
    //  */
    // fetch = async (id: string) => {
    //     const challenge = await prisma.challenges.findFirst({
    //         where: {
    //             id,
    //             deletedAt: null
    //         },
    //         include: {
    //             challengeOptions: true
    //         }
    //     });

    //     return challenge ?? <Challenge>{}; 
    // }

    // /**
    //  * Retrieves a paginated list of challenges with search and cursor-based navigation.
    //  * 
    //  * @description Utilizes keyset pagination via a composite cursor (id + createdAt) 
    //  * to maintain high performance and stable sort orders across large datasets.
    //  * 
    //  * @param {PaginationData} data - Filtering and pagination parameters.
    //  * @returns {Promise<Challenge[]>} A collection of challenge records matching the criteria.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<Challenge[]> => {
    //     let where: any = {
    //         deletedAt: null,
    //         AND: [
    //             ...(data.search ? [
    //                 {
    //                     OR: [
    //                         {
    //                             question: {
    //                                 contains: data.search,
    //                                 mode: 'insensitive'
    //                             }
    //                         }
    //                     ]
    //                 }
    //             ] : [])
    //         ]
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const challenges = await prisma.challenges.findMany({
    //         take: data.limit ?? 10,
    //         where,
    //         orderBy: [
    //             { createdAt: data.sort as 'asc' | 'desc' },
    //             { id: data.sort as 'asc' | 'desc' }
    //         ]
    //     });

    //     return challenges;
    // }




    // /**
    //  * Updates an active challenge's data by its ID.
    //  * 
    //  * @param {string} id - The unique ID of the challenge to update.
    //  * @param {Partial<challenges>} data - The new data to apply to the record.
    //  * @returns {Promise<challenges | null>} The updated challenge, or null if it was deleted or not found.
    //  * @note Filters for 'deletedAt: null' to ensure only active records are modified.
    //  */
    // update = async (data: any, id: string): Promise<Challenge> => {
    //     const challenge = await prisma.challenges.update({
    //         where: {
    //             id,
    //             deletedAt: null
    //         },
    //         data: data
    //     });

    //     return challenge;
    // }

    // /**
    //  * Performs a soft delete on a challenge by setting its 'deletedAt' timestamp.
    //  * 
    //  * @param {string} id - The unique identifier of the challenge to delete.
    //  * @returns {Promise<challenges>} The updated challenge record with the 'deletedAt' value set.
    //  * @throws {PrismaClientKnownRequestError} If the record is not found or already deleted.
    //  */
    // softDelete = async (id: string): Promise<Challenge> => {
    //     const challenge = await prisma.challenges.update({
    //         where: {
    //             id,
    //             deletedAt: null
    //         },
    //         data: {
    //             deletedAt: new Date()
    //         }
    //     });

    //     return challenge;
    // }

    // /**
    //  * Permanently removes a challenge record from the database.
    //  * 
    //  * @param {string} id - The unique identifier of the challenge to delete.
    //  * @returns {Promise<challenges>} The deleted challenge record data.
    //  * @throws {PrismaClientKnownRequestError} P2025 if the record does not exist.
    //  * @note Use with caution: This bypasses 'deletedAt' logic and removes the record entirely.
    //  */
    // hardDelete = async (id: string): Promise<Challenge> => {
    //     const challenge = await prisma.challenges.delete({
    //         where: {
    //             id
    //         }
    //     });

    //     return challenge;
    // }
}

export { ChallengeRepository }