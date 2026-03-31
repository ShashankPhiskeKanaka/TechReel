import { prisma } from "../../db/prisma.js";
import type { ChallengeSubmissionData, ChallengeSubmission } from "../dto/challengeSubmission.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class ChallengeSubmissionRepository extends BaseRepository<ChallengeSubmission, ChallengeSubmissionData, any> {

    constructor() {
        super(prisma.challenge_submissions, "Challenge submission");
    }

    /**
     * Processes a challenge submission and calculates scoring.
     * 
     * @param {any} data - Submission details including userId, challengeId, and correctness.
     * @param {Prisma.TransactionClient} [client] - Optional Prisma client or transaction instance.
     * @returns {Promise<ChallengeSubmission>} The created submission record or an empty object if exhausted.
     */
    submit = async (data: any, client: any = prisma): Promise<ChallengeSubmission> => {
        const submissions = await client.challenge_submissions.findMany({
            where: {
                userId: data.userId,
                challengeId: data.challengeId
            }
        });

        const correctSubmission = submissions.some((s: ChallengeSubmission) => s.isCorrect);

        if (!correctSubmission && submissions.length < 3) {
            const score = data.isCorrect ? 10 - (submissions.length * 2) : -1;

            const challengeData = await client.challenge_submissions.create({
                data: {
                    userId: data.userId,
                    challengeId: data.challengeId,
                    answer: data.answer,
                    isCorrect: data.isCorrect,
                    score,
                    roadmapStepId: data.roadmapStepId ?? "NA"
                }
            });

            return challengeData;
        }

        return <ChallengeSubmission>{};
    }

    // /**
    //  * Retrieves a challenge submission by its unique identifier.
    //  * 
    //  * @param {string} id - The unique identifier of the submission.
    //  * @returns {Promise<ChallengeSubmission>} The found submission or an empty object.
    //  */
    // fetch = async (id: string, userId?: string): Promise<ChallengeSubmission> => {
    //     const challengeSubmission = await prisma.challenge_submissions.findFirst({
    //         where: {
    //             id,
    //             ...(userId ? {userId} : {})
    //         }
    //     });

    //     return challengeSubmission ?? <ChallengeSubmission>{};
    // }

    // /**
    //  * Fetches a paginated list of all challenge submissions.
    //  * 
    //  * @description Supports cursor-based pagination using a composite key (id + createdAt). 
    //  * Includes optional user-level scoping for security or profile-specific views.
    //  * 
    //  * @param {PaginationData} data - Pagination metadata including limit, sort, and cursors.
    //  * @param {string} [userId] - Optional ID to restrict results to a specific user.
    //  * @returns {Promise<ChallengeSubmission[]>} A collection of submission records.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<ChallengeSubmission[]> => {

    //     let where: any = {
    //         AND: []
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const challengeSubmissions = await prisma.challenge_submissions.findMany({
    //         take: data.limit ?? 10,
    //         where,
    //         orderBy: [
    //             { createdAt: data.sort as 'asc' | 'desc' },
    //             {id: data.sort as 'asc' | 'desc'}            
    //         ]
    //     });

    //     return challengeSubmissions;
    // }

    // /**
    //  * Permanently removes a challenge submission from the database.
    //  * 
    //  * @param {string} id - The unique identifier of the submission to delete.
    //  * @returns {Promise<ChallengeSubmission>} The deleted submission record.
    //  */
    // delete = async (id: string): Promise<ChallengeSubmission> => {
    //     const challengeSubmission = await prisma.challenge_submissions.delete({
    //         where: {
    //             id
    //         }
    //     });

    //     return challengeSubmission;
    // }


}

export { ChallengeSubmissionRepository }