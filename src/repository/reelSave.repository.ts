import { prisma } from "../../db/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { errorMessage } from "../constants/error.messages.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { ReelSave, ReelSaveData } from "../dto/reelSave.dto.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class ReelSaveRepsitory extends BaseRepository<ReelSave, ReelSaveData, any> {
    constructor() {
        super(prisma.reel_saves, "REEL-SAVE");
    }

    create = async (data: ReelSaveData): Promise<ReelSave> => {

        return await prisma.$transaction(async (tx) => {
            try {
                const folder = await tx.reel_folders.findUnique({
                    where: {
                        id: data.folderId,
                        userId: data.userId
                    }
                });

                if(!folder) {
                    logger.warn("The folder doesnt belong to the user", {
                        userId: data.userId,
                        folderId: data.folderId
                    });

                    throw new serverError(errorMessage.UNAUTHORIZED); 
                }

                return await tx.reel_saves.create({ data });
                
            } catch (error) {
                this.handlePrismaError(error);
            }
        })
    
    };
}

export { ReelSaveRepsitory }