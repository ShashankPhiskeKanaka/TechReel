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
    // /**
    //  * updates profile data
    //  * 
    //  * @param id 
    //  * @param data 
    //  * @returns 
    //  */
    // updateProfile = async (id: string, data: any) => {
    //     const profile = await this.UserProfileMethods.updateProfile(id, data);

    //     logger.info("User profile updated successfully", {
    //         userId: id,
    //         profileId: profile.id
    //     });

    //     await redisUtils.invalidateKey(id, Resource.USER, Action.UPDATE);

    //     return profile;
    // }

}

export { UserProfileService }