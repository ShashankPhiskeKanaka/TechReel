import { prisma } from "../db/prisma.js";
import type { StreakData, Streak } from "../dto/streak.dto.js";

class StreakRepository {
    create = async (data: StreakData): Promise<Streak> => {
        const streak = await prisma.streaks.create ({
            data: data
        });

        return streak;
    }

    find = async (id: string): Promise<Streak> => {
        const streak = await prisma.streaks.findFirst({
            where: {
                id: id
            }
        });

        return streak ?? <Streak>{};
    }

    findByUser = async (userId: string): Promise<Streak> => {
        const streak = await prisma.streaks.findFirst({
            where: {
                user_id: userId
            }
        });

        return streak ?? <Streak>{};
    }

    delete = async (id: string): Promise<Streak> => {
        const streak = await prisma.streaks.delete({
            where: {
                id: id
            }
        });

        return streak;
    }
}

export { StreakRepository }