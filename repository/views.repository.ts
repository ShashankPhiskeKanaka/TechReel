import { prisma } from "../db/prisma.js";
import type { Views, ViewsData } from "../dto/views.dto.js";

class ViewsRepository {
    createViewsRecord = async (data: any) : Promise<Views> => {
        const viewRecord = await prisma.reel_views.create({
            data: data
        });

        return viewRecord;
    }

    fetchViewsRecord = async (id: string) : Promise<Views> => {
        const viewRecord = await prisma.reel_views.findUnique({
            where: {
                id: id
            }
        });

        return viewRecord ?? <Views>{};
    }

    fetchTotalViews = async (reelId: string, userId: string) => {
        const views = await prisma.reel_views.count({
            where: {
                reel_id: reelId,
                user_id: userId
            }
        });

        return views;   
    }

}

export { ViewsRepository };