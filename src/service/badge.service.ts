import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { Badge, BadgeData } from "../dto/badge.dto.js";
import type { BadgeRepository } from "../repository/badge.repository.js";
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";
import { BaseService } from "./base.service.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../db/s3.js";
import { config } from "../config/index.js";

class BadgeService extends BaseService<Badge, BadgeData, BadgeRepository> {

    constructor(methods: BadgeRepository) {
        super(methods, "BADGE");
    }

    /**
     * Handles the business logic for creating a badge.
     * Orchestrates database persistence, cache invalidation, and generates a 
     * secure S3 presigned URL for the initial image upload.
     * 
     * @param {BadgeData} badgeData - The initial configuration for the badge and image.
     * @returns {Promise<{ badge: Badge, uploadUrl: string }>} The created badge and a 1-hour S3 upload link.
     */
    create = async (badgeData: BadgeData): Promise<any> => {
        const { badge, imageRecord } = await this.methods.create(badgeData);

        logger.info("New badge created", {
            badgeId: badge.id
        });

        redisUtils.invalidateKey(badge.userId ? badge.userId : "PUBLIC", this.modelName, "CREATE")

        const key = await `uploads/${Date.now()}-${imageRecord.id}`;

        const command = new PutObjectCommand({
            Bucket: config.awsImageBucket,
            Key: key,
            ContentType: imageRecord.imageType,
            ChecksumAlgorithm: undefined,
            Metadata: {
                imageId: imageRecord.id,
            }
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return { badge, uploadUrl };   
    }

    /**
     * Handles the business logic for updating a badge.
     * Updates the database, invalidates cache, cleans up the previous S3 asset 
     * if a new image is requested, and provides a new presigned URL.
     * 
     * @param {BadgeData} badgeData - The updated data. 
     * @returns {Promise<{ badge: Badge, uploadUrl: string }>} The updated badge and new upload link.
     * @note This method performs an asynchronous cleanup of the old S3 object.
     */
    update = async (badgeData: BadgeData): Promise<any> => {
        const { badge, imageRecord, oldImageRecord } = await this.methods.create(badgeData);

        logger.info("Badge updated", {
            badgeId: badge.id
        });

        redisUtils.invalidateKey(badge.userId ? badge.userId : "PUBLIC", this.modelName, "UPDATE")

        await s3Client.send(new DeleteObjectCommand({
            Bucket: config.awsImageBucket,
            Key: oldImageRecord.key
        }));

        const key = await `uploads/${Date.now()}-${imageRecord.id}`;

        const command = new PutObjectCommand({
            Bucket: config.awsImageBucket,
            Key: key,
            ContentType: imageRecord.imageType,
            ChecksumAlgorithm: undefined,
            Metadata: {
                imageId: imageRecord.id,
            }
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return { badge, uploadUrl };
    }

    /**
     * Performs a permanent hard delete of a badge.
     * Synchronizes the removal of database records and the corresponding S3 object.
     * 
     * @param {string} id - The unique identifier of the badge to delete.
     * @returns {Promise<Badge>} The final state of the deleted badge before removal.
     * @throws {Error} If the database deletion or S3 cleanup fails.
     */
    delete = async (id: string): Promise<Badge> => {
        const { badge, imageRecord } = await this.methods.hardDelete(id);

        logger.info("Badge deleted", {
            badgeId: badge.id
        });

        await s3Client.send(new DeleteObjectCommand({
            Bucket: config.awsImageBucket,
            Key: imageRecord.key
        }));

        return badge;
    }
}

export { BadgeService }