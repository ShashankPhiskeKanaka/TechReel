import { errorMessage } from "../constants/error.messages.js";
import { prisma } from "../db/prisma.js"
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { UserRoadmapStep, UserRoadmapStepData } from "../dto/userRoadmapStep.dto.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { serverUtils } from "../utils/server.utils.js";

class UserRoadmapStepsRepository {

    /**
     * Records a user's progress on a roadmap step after validating the sequence.
     * Ensures the user is not skipping steps by comparing the new step order with their previous progress.
     * @param {UserRoadmapStepData} data - The user ID and roadmap step ID to record.
     * @param {any} [client=prisma] - Optional Prisma client or transaction instance.
     * @returns {Promise<Object>} An object containing the current step details and the highest available step in the roadmap.
     * @throws {serverError} If the user attempts to skip a step in the sequence.
     */
    create = async (data: UserRoadmapStepData, client: any = prisma) => {

        const [currentStep, highestStep, previousUserStep] = await Promise.all([
            client.roadmap_steps.findFirst({
                where: {
                    id: data.roadmapStepId
                },
                select: {
                    stepOrder: true,
                    roadmapId: true,
                    roadmap: true
                }
            }),

            client.roadmap_steps.findFirst({
                orderBy: {
                    stepOrder: "desc"
                }
            }),

            client.user_roadmap_steps.findFirst({
                where: {
                    userId: data.userId
                },
                orderBy: {
                    stepOrder: "desc"
                },
                select: {
                    stepOrder: true,
                    roadmapStepId: true
                }
            })
        ]);        

        if (previousUserStep?.stepOrder ?? 0 + 1 != currentStep?.stepOrder) {
            logger.warn("User skipped roadmap step", {
                userId: data.userId,
                roadmapStepId: data.roadmapStepId
            });

            throw new serverError(errorMessage.INVALIDDATA);
        }

        await client.user_roadmap_steps.create({
            data: {
                userId: data.userId,
                roadmapStepId: data.roadmapStepId,
                stepOrder: currentStep.stepOrder
            }
        });

        return { currentStep, highestStep };
    }

    /**
     * Retrieves a specific roadmap step completion record for a user.
     * @param {string} id - The unique identifier of the user_roadmap_step record.
     * @param {string} userId - The ID of the user to ensure ownership of the record.
     * @returns {Promise<UserRoadmapStep>} The completion record or an empty object if not found.
     */
    fetch = async (id: string, userId?: string): Promise<UserRoadmapStep> => {
        const userRoadmapStep = await prisma.user_roadmap_steps.findFirst({
            where: {
                id,
                ...(userId ? {userId} : {})
            }
        });

        return userRoadmapStep ?? <UserRoadmapStep>{};
    }

    /**
     * Retrieves a paginated list of roadmap steps completed by users, with optional filtering by user or step.
     * @param {PaginationData} data - Pagination and sorting settings.
     * @param {Object} filters - Key-value pairs for additional filtering.
     * @param {string} [userId] - Optional filter for a specific user's progress.
     * @param {string} [roadmapStepId] - Optional filter for a specific roadmap step.
     * @returns {Promise<UserRoadmapStep[]>} A list of matching roadmap completion records.
     */
    fetchAll = async (data: PaginationData, filters: {}, userId?: string, roadmapStepId?: string): Promise<UserRoadmapStep[]> => {

        let where: any = {
            ...(userId ? {userId} : {}),
            ...(roadmapStepId ? {roadmapStepId} : {}),
            AND: []
        }

        where = serverUtils.buildWhere(where, filters, data);

        const userRoadmapSteps = await prisma.user_roadmap_steps.findMany({
            take: data.limit ?? PaginationConstants.limit,
            where,
            orderBy: [
                {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
                {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
            ]
        });

        return userRoadmapSteps;
    }

    /**
     * Permanently deletes a user's roadmap step completion record.
     * @param {string} id - The ID of the record to remove.
     * @returns {Promise<void>}
     */
    delete = async (id: string) => {
        const userRoadmapStep = await prisma.user_roadmap_steps.delete({
            where: {
                id
            }
        });

        return;
    }
}

export { UserRoadmapStepsRepository }