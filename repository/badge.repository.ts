import { prisma } from "../db/prisma.js";
import type { Badge, BadgeData } from "../dto/badge.dto.js";

class BadgeRepository {
    create = async (data: BadgeData): Promise<Badge> => {
        const badge = await prisma.badges.create({
            data: data
        });

        return badge ?? <Badge>{};
    }

    find = async (id: string): Promise<Badge> => {
        const badge = await prisma.badges.findFirst({
            where: {
                id,
                deleted_at: null
            }
        });

        return badge ?? <Badge>{};
    }

    findBySkill = async (skillId: string): Promise<Badge[]> => {
        const badges = await prisma.badges.findMany({
            where: {
                skill_id: skillId,
                deleted_at: null
            }
        });

        return badges;
    }

    update = async (data: any): Promise<Badge> => {
        const badge = await prisma.badges.update({
            where: {
                id: data.id,
                deleted_at: null
            },
            data: data
        });

        return badge;
    }

    softDelete = async (id: string): Promise<Badge> => {
        const badge = await prisma.badges.update({
            where: {
                id,
                deleted_at: null
            },
            data: {
                deleted_at: new Date()
            }
        });

        return badge;
    }

    hardDelete = async (id: string): Promise<Badge> => {
        const badge = await prisma.badges.delete({
            where: {
                id
            }
        });

        return badge;
    }
}

export { BadgeRepository }