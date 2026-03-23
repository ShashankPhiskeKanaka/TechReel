import { prisma } from "../db/prisma.js";
import type { UserBadge, UserBadgeData } from "../dto/badge.dto.js";

class UserBadgesRepository {
    create = async (data: UserBadgeData): Promise<UserBadge> => {
        const userBadge = await prisma.user_badges.create({
            data: data
        });

        return userBadge;
    }

    fetch = async (id: string): Promise<UserBadge> => {
        const userBadge = await prisma.user_badges.findFirst({
            where: {
                id
            }
        });

        return userBadge ?? <UserBadge>{};
    }

    fetchByUser = async (userId: string): Promise<UserBadge> => {
        const userBadge = await prisma.user_badges.findFirst({
            where: {
                user_id: userId
            }
        });

        return userBadge ?? <UserBadge> {};
    }

    delete = async (id: string): Promise<UserBadge> => {
        const userBadge = await prisma.user_badges.delete({
            where: {
                id
            }
        });

        return userBadge;
    }
}

export { UserBadgesRepository };