import { DeleteObject$, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { errorMessage } from "../constants/error.messages.js";
import { ServiceMessages } from "../constants/service.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { Token, TokenData } from "../dto/token.dto.js";
import type { TokenRepository } from "../repository/token.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";
import { BaseService } from "./base.service.js";
import { config } from "../config/index.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../db/s3.js";

const serviceMessage = new ServiceMessages("Token");

class TokenService extends BaseService<Token, TokenData, any> {
    constructor(methods: TokenRepository) {
        super(methods, "TOKEN");
    }

    /**
     * Handles the creation of a new Token and its associated image metadata.
     * Orchestrates database persistence, cache invalidation for public feeds, 
     * and conditionally generates an S3 presigned URL if image data is provided.
     * 
     * @param {TokenData} data - The token properties including optional image metadata.
     * @returns {Promise<{token: any, uploadUrl?: string}>} The created token and a temporary S3 upload link.
     */
    create = async (data: TokenData): Promise<any> => {
        const { token, imageRecord } = await this.methods.create(data);

        logger.info(serviceMessage.CREATE.message, {
            tokenId: token.id
        });

        await redisUtils.invalidateKey("PUBLIC", "TOKEN", "CREATE");

        let uploadUrl;

        if(imageRecord) {
            const key = `uploads/${Date.now()}-${imageRecord.id}`;

            const command = new PutObjectCommand({
                Bucket: config.awsImageBucket,
                Key: key,
                ContentType: data.imageType,
                ChecksumAlgorithm: undefined,
                Metadata: {
                    imageId: imageRecord.id
                }
            });

            uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        }

        return {token, uploadUrl};
    }

    /**
     * Updates an existing Token and rotates its S3 asset.
     * Synchronously deletes the previous S3 object to prevent storage bloat 
     * and generates a fresh presigned URL for the updated image.
     * 
     * @param {TokenData} data - The partial token data to update.
     * @param {string} id - The unique identifier of the token.
     * @returns {Promise<{token: any, uploadUrl: string}>} The updated token and a new S3 upload link.
     * @throws {Error} If the S3 deletion or presigned URL generation fails.
     */
    update = async (data: TokenData, id : string): Promise<any> => {
        const {token, imageRecord} = await this.methods.update(data, id);

        logger.info(serviceMessage.UPDATE.message, {
            tokenId: id
        });

        await redisUtils.invalidateKey("PUBLIC", "TOKEN", "UPDATE");

        await s3Client.send(new DeleteObjectCommand({
            Bucket: config.awsImageBucket,
            Key: imageRecord.key
        }));

        let uploadUrl;

        
        const key = `uploads/${Date.now()}-${imageRecord.id}`;

        const command = new PutObjectCommand({
            Bucket: config.awsImageBucket,
            Key: key,
            ContentType: data.imageType,
            ChecksumAlgorithm: undefined,
            Metadata: {
                imageId: imageRecord.id
            }
        });

        uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        

        return {token, uploadUrl};
    }

    /**
     * Permanently removes a Token and its linked S3 resources.
     * Performs a hard delete in the database followed by a physical removal 
     * of the associated file in AWS S3.
     * 
     * @param {string} id - The unique identifier of the token to be purged.
     * @returns {Promise<any>} The deleted token record data.
     */
    hardDelete = async (id: string) => {
        const { token, imageRecord} = await this.methods.delete(id);

        logger.info(serviceMessage.UPDATE.message, {
            tokenId: id
        });

        await redisUtils.invalidateKey("PUBLIC", "TOKEN", "DELETE");

        await s3Client.send(new DeleteObjectCommand({
            Bucket: config.awsImageBucket,
            Key: imageRecord.key
        }));

        return token;
    }
}

export { TokenService }