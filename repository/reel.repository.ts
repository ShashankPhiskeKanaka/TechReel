import { prisma } from "../db/prisma.js"
import type { ReelData, Reel, ReelUpdateData } from "../dto/reel.dto.js";
import { status } from "../generated/prisma/enums.js";

class ReelRespository {
    create = async (data: ReelData) : Promise<Reel> => {
        const reel = await prisma.reels.create({
            data: {
                ...data,
                status: status.PENDING 
            }
        });

        return reel;
    }

    updateStatus = async (status: status, id: string, data: any) : Promise<Reel> => {
        const reel = await prisma.reels.update({
            where: {
                id,
                deleted_at: null
            },
            data: {
                status: status,
                video_url: data.url,
                thumbnail_url: data.thumbnailUrl,
                duration: data.duration
            }
        });

        return reel;
    }

    update = async (data: any, id: string): Promise<Reel> => {
        const reel = await prisma.reels.update({
            where: {
                id,
                deleted_at: null
            },
            data
        });

        return reel;
    }

    get = async (id: string) : Promise<Reel> => {
        const reel = await prisma.reels.findUnique({
            where: {
                id,
                deleted_at: null
            }
        });

        return reel ?? <Reel>{};
    }

    softDelete = async (id: string) : Promise<Reel> => {
        const reel = await prisma.reels.update({
            where: {
                id,
                deleted_at: null
            },
            data: {
                deleted_at: new Date()
            }
        });

        return reel;
    }

    hardDelete = async (id: string) : Promise<Reel> => {
        const reel = await prisma.reels.delete({
            where: {
                id
            }
        });

        return reel;
    }
}

export { ReelRespository }