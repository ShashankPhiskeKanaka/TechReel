import { prisma } from "../db/prisma.js";
import type { SkillRoadmap, SkillRoadmapData } from "../dto/skills.dto.js";

class SkillRoadmapRepository {
    create = async (data: SkillRoadmapData): Promise<SkillRoadmap> => {
        const skillRoadmap = await prisma.skill_roadmaps.create({
            data: data
        });

        return skillRoadmap;
    }

    fetch = async (id: string): Promise<SkillRoadmap> => {
        const skillRoadmap = await prisma.skill_roadmaps.findFirst({
            where: {
                id
            }
        });

        return skillRoadmap ?? <SkillRoadmap>{};
    }

    update = async (data: any, id: string) : Promise<SkillRoadmap> => {
        const skillRoadmap = await prisma.skill_roadmaps.update({
            where: {
                id
            },
            data: data
        });

        return skillRoadmap
    }

    delete = async (id: string) : Promise<SkillRoadmap> => {
        const skillRoadmap = await prisma.skill_roadmaps.delete({
            where:{
                id
            }
        });

        return skillRoadmap;
    }
}

export { SkillRoadmapRepository };