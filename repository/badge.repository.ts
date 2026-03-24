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
                deletedAt: null
            }
        });

        return badge ?? <Badge>{};
    }

    findBySkill = async (skillId: string): Promise<Badge[]> => {
        const badges = await prisma.badges.findMany({
            where: {
                skillId,
                deletedAt: null
            }
        });

        return badges;
    }

    update = async (data: any): Promise<Badge> => {
        const badge = await prisma.badges.update({
            where: {
                id: data.id,
                deletedAt: null
            },
            data: data
        });

        return badge;
    }

    softDelete = async (id: string): Promise<Badge> => {
        const badge = await prisma.badges.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
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