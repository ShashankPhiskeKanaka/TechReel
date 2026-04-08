import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Action, Resource } from "../dto/redis.dto.js";
import type { UserProfileData, UserProfile } from "../dto/userProfile.dto.js";
import type { UserProfileRepository } from "../repository/userProfile.repository.js";
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";
import { BaseService } from "./base.service.js";
import { config } from "../config/index.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../db/s3.js";
import type { ImageRepository } from "../repository/image.repository.js";

class UserProfileService extends BaseService<UserProfile, UserProfileData, any> {

    constructor(methods: UserProfileRepository, private imageMethods: ImageRepository) {
        super(methods, "USER-PROFILE");
    }

    /**
     * Orchestrates record creation and triggers cache invalidation.
     * 
     * @param data - The payload to create the record.
     * @returns {Promise<T>} The newly created record.
     */
    create = async (data: UserProfileData): Promise<any> => {
        const { profile, imageRecord } = await this.methods.create(data);
        logger.info(`${this.modelName} created`, {
            id: profile.id,
        });

        redisUtils.invalidateKey(profile.userId ? profile.userId : "PUBLIC", this.modelName, "UPDATE")

        const key = await `uploads/${Date.now()}-${imageRecord.id}`;

        const command = new PutObjectCommand({
            Bucket: config.awsRawBucket,
            Key: key,
            ContentType: imageRecord.imageType,
            ChecksumAlgorithm: undefined,
            Metadata: {
                imageId: imageRecord.id,
            }
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return  { profile, uploadUrl };
    }

    /**
     * Updates a User Profile and manages the rotation of its S3 image assets.
     * 
     * If a new image is provided, this method orchestrates:
     * 1. Database persistence via a transaction.
     * 2. Invalidation of user-specific or public cache keys.
     * 3. Physical deletion of the previous S3 object to prevent storage leaks.
     * 4. Generation of a new 1-hour presigned URL for the updated asset.
     * 
     * @param {any} data - The partial profile data and image metadata.
     * @param {string} id - The unique identifier (UUID) of the profile to update.
     * @returns {Promise<{ profile: any, uploadUrl: string }>} The updated profile and new S3 upload link.
     * @throws {Error} If the S3 cleanup or signed URL generation fails.
     */
    update = async (data: any, id: string): Promise<any> => {
        const { profile, imageRecord, oldImageRecord } = await this.methods.update(data, id);
        logger.info(`${this.modelName} created`, {
            id: profile.id,
        });

        redisUtils.invalidateKey(profile.userId ? profile.userId : "PUBLIC", this.modelName, "UPDATE")

        if(oldImageRecord) {
            await s3Client.send(new DeleteObjectCommand({
                Bucket: config.awsImageBucket,
                Key: oldImageRecord.key
            }));
        }

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

        return { profile, uploadUrl };
    }

}

export { UserProfileService }