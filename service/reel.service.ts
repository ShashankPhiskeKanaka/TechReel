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
import { redisUtils } from "../utils/redis.utils.js";
import { Resource } from "../dto/redis.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";

class ReelService {

    constructor(private ReelMethods: ReelRespository) {}

    /**
     * Initializes the reel upload process by creating a metadata record and S3 signed URL.
     * 
     * @param {ReelData} data - The initial reel metadata (title, creator, etc.).
     * @returns {Promise<{uploadUrl: string, key: string, reel: reels}>} 
     * @note Creates the DB record first to ensure the S3 object can be tagged with a reelId.
     */
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

        await redisUtils.invalidateKey("PUBLIC", Resource.REEL, "CREATE");

        return { uploadUrl, key, reel };
    }

    /**
     * Updates reel metadata and invalidates the associated cache.
     * 
     * @param {any} data - Partial update payload.
     * @param {string} id - The unique Reel ID.
     * @returns {Promise<reels>} The updated reel record.
     * @throws {ServerError} 404 if the reel is not found.
     */

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

    /**
     * Updates reel metadata and invalidates the associated cache.
     * 
     * @param {any} data - Partial update payload.
     * @param {string} id - The unique Reel ID.
     * @returns {Promise<reels>} The updated reel record.
     * @throws {ServerError} 404 if the reel is not found.
     */

    update = async (data: any, id: string) => {
        const reel = await this.ReelMethods.update(data, id);

        logger.info("Reel metadata updated", {
            reelId: id
        })

        return reel;
    }

    /**
     * Retrieves a single reel's metadata by ID.
     * 
     * @param {string} id - The unique Reel ID.
     * @returns {Promise<reels>}
     * @throws {ServerError} 404 if missing or soft-deleted.
     */

    fetch = async (id: string) => {
        const reel = await this.ReelMethods.fetch(id);

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

    fetchAll = async (data: PaginationData, filters: {}, saerchFields: string[]) => {
        const reels = await this.ReelMethods.fetchAll(data, filters, saerchFields);

        logger.info("Reels fetched");

        return reels;
    }

    /**
     * Removes reel metadata and triggers cleanup for related S3 assets and caches.
     * 
     * @param {boolean} flag - True for hard delete, false for soft.
     * @param {string} id - The unique Reel ID.
     */

    delete = async (id: string, flag: boolean) => {
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