import { prisma } from "../../db/prisma.js"
import type { SkillRoadmapStep, SkillRoadmapStepData } from "../dto/skillRoadmapStep.dto.js";
import { BaseRepository } from "./base.repository.js";

class SkillRoadmapStepRepository extends BaseRepository<SkillRoadmapStep, SkillRoadmapStepData, any> {

    constructor() {
        super(prisma.roadmap_steps, "Skill roadmap step");
    }
    // create = async (data: SkillRoadmapStepData): Promise<SkillRoadmapStep> => {
    //     const step = await prisma.roadmap_steps.create({
    //         data: data
    //     });

    //     return step;
    // }

    // fetch = async (id: string): Promise<SkillRoadmapStep> => {
    //     const step = await prisma.roadmap_steps.findFirst({
    //         where: {
    //             id
    //         }
    //     });

    //     return step ?? <SkillRoadmapStep>{};
    // }

    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<SkillRoadmapStep[]> => {

    //     let where: any = {
    //         AND: []
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const skillRoadmapSteps = prisma.roadmap_steps.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
    //             {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return skillRoadmapSteps;
    // }

    // update = async (data: any, id: string): Promise<SkillRoadmapStep> => {
    //     const step = await prisma.roadmap_steps.update({
    //         where: {
    //             id
    //         },
    //         data: data
    //     });

    //     return step;
    // }

    // delete = async (id: string): Promise<SkillRoadmapStep> => {
    //     const step = await prisma.roadmap_steps.delete({
    //         where: {
    //             id
    //         }
    //     });

    //     return step;
    // }
}

export { SkillRoadmapStepRepository }