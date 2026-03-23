import { prisma } from "../db/prisma.js"
import type { SkillRoadmapStep, SkillRoadmapStepData } from "../dto/skills.dto.js"

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

    fetchByRoadmap = async (id: string): Promise<SkillRoadmapStep[]> => {
        const steps = await prisma.roadmap_steps.findMany({
            where: {
                roadmap_id: id
            }
        });

        return steps;
    }

    fetchByReel = async (id: string): Promise<SkillRoadmapStep> => {
        const step = await prisma.roadmap_steps.findFirst({
            where: {
                reel_id: id
            }
        });

        return step ?? <SkillRoadmapStep>{};
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