import { prisma } from "../db/prisma.js"
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { SkillRoadmapStep, SkillRoadmapStepData } from "../dto/skill.dto.js"
import { serverUtils } from "../utils/server.utils.js";

class SkillsRoadmapStepsRepository {
    create = async (data: SkillRoadmapStepData): Promise<SkillRoadmapStep> => {
        const step = await prisma.roadmap_steps.create({
            data: data
        });

        return step;
    }

    fetch = async (id: string): Promise<SkillRoadmapStep> => {
        const step = await prisma.roadmap_steps.findFirst({
            where: {
                id
            }
        });

        return step ?? <SkillRoadmapStep>{};
    }

    fetchAll = async (data: PaginationData, filters: {}): Promise<SkillRoadmapStep[]> => {

        let where: any = {
            AND: [
                ...(data.search ? [
                    {
                        OR: [
                            {
                                title: {
                                    contains: data.search,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                ] : [])
            ]
        }

        where = serverUtils.buildWhere(where, filters, data);

        const skillRoadmapSteps = prisma.roadmap_steps.findMany({
            take: data.limit ?? PaginationConstants.limit,
            where,
            orderBy: [
                {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
                {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
            ]
        });

        return skillRoadmapSteps;
    }

    update = async (data: any, id: string): Promise<SkillRoadmapStep> => {
        const step = await prisma.roadmap_steps.update({
            where: {
                id
            },
            data: data
        });

        return step;
    }

    delete = async (id: string): Promise<SkillRoadmapStep> => {
        const step = await prisma.roadmap_steps.delete({
            where: {
                id
            }
        });

        return step;
    }
}

export { SkillsRoadmapStepsRepository }