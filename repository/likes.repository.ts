import { prisma } from "../db/prisma.js";
import type { Like, LikeData } from "../dto/likes.dto.js";

class LikesRepository {
    create = async (data: LikeData ) : Promise<Like> => {
        const like = await prisma.reel_likes.create({
            data: data
        });
    
        return like;
    }

    fetch = async (id: string) : Promise<Like> => {
        const like = await prisma.reel_likes.findUnique({
            where: {
                id: id
            }
        });

        return like ?? <Like>{};
    }

    fetchLikes = async (userId: string, reelId: string) => {
        const likes = await prisma.reel_likes.count({
            where: {
                user_id: userId,
                reel_id: reelId
            }
        });

        return likes;
    }

    delete = async (userId: string, reelId: string) => {
        const like = await prisma.reel_likes.deleteMany({
            where: {
                user_id: userId,
                reel_id: reelId
            }
        });

        return like.count;
    }
}