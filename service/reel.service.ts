import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../db/s3.js";
import type { ReelRespository } from "../repository/reel.repository.js";
import type { ReelData } from "../dto/reel.dto.js";
import type { status } from "../generated/prisma/enums.js";
import { logger } from "../utils/logger.js";
import { serverError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.messages.js";
import { uuidv4 } from "zod";

class ReelService {

    constructor(private ReelMethods: ReelRespository) {}

    createPresignedUrl = async (data: ReelData) => {

        const reel = await this.ReelMethods.create({
            ...data
        });

        logger.info("Reel metadata record created", {
            reelId: reel.id,
            creatorId: data.creatorId
        });

        const key = `uploads/${Date.now()}-${reel.id}-${data.title}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_RAW_BUCKET,
            Key: key,
            ContentType: 'video/mp4',
            ChecksumAlgorithm: undefined,
            Metadata: {
                reelId : reel.id
            }
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        logger.info("Pre signed url generated for uploading reel", {
            reelId: reel.id,
            creatorId: data.creatorId
        });

        return { uploadUrl, key, reel };
    }

    updateStatus = async (status: status, id: string, data: any) => {

        const reel = await this.ReelMethods.updateStatus(status, id, data);

        if(!reel.id) {
            logger.warn("The reel doesnt exist for id", {
                videoId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Reel metadata updated", {
            reelId: id
        });

        return reel;
    }

    update = async (data: any, id: string) => {
        const reel = await this.ReelMethods.update(data, id);

        logger.info("Reel metadata updated", {
            reelId: id
        })

        return reel;
    }

    get = async (id: string) => {
        const reel = await this.ReelMethods.get(id);

        if(!reel.id) {
            logger.warn("No reel with the id found", {
                reelId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Reel metadata fetched", {
            reelId: id
        });

        return reel;
    }

    delete = async (flag: boolean, id: string) => {
        let reel;
        if(flag) {
            reel = await this.ReelMethods.hardDelete(id);
            logger.info("Reel metadata hard deleted", {
                reelId: id
            });
        }else{
            reel = await this.ReelMethods.softDelete(id);
            logger.info("Reel metadata soft deleted", {
                reelId: id
            });
        }

        return reel;
    }

}

export { ReelService };