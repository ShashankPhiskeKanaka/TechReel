import { prisma } from "../db/prisma.js"
import type { Skill, SkillData } from "../dto/skills.dto.js"

class SkillRepository {
    create = async (data: SkillData) : Promise<Skill> => {
        const skill = await prisma.skills.create({
            data
        });

        return skill;
    }

    get = async (id: string) : Promise<Skill> => {
        const skill = await prisma.skills.findUnique({
            where: {
                id,
                deleted_at: null
            }
        });

        return skill ?? <Skill>{};
    }

    update = async (data: SkillData, id: string) : Promise<Skill> => {
        const skill = await prisma.skills.update({
            where : {
                id,
                deleted_at: null
            },
            data
        });

        return skill;
    }

    softDelete = async (id: string) : Promise<Skill> => {
        const skill = await prisma.skills.update({
            where: {
                id,
                deleted_at: null
            },
            data: {
                deleted_at: new Date()
            }
        });

        return skill;
    }

    hardDelete = async (id: string) : Promise<Skill> => {
        const skill = await prisma.skills.delete({
            where: {
                id
            }
        });

        return skill;
    }
}

export { SkillRepository }