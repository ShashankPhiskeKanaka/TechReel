import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { Image, ImageData } from "../dto/image.dto.js";
import type { ImageRepository } from "../repository/image.repository.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";
import { config } from "../config/index.js";
import { serverError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.messages.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../db/s3.js";
import { redisUtils } from "../utils/redis.utils.js";

class ImageService extends BaseService<Image, ImageData, any> {
    constructor(methods: ImageRepository) {
        super(methods, "IMAGE");
    }

    fetchPresignedUrl = async (data: ImageData) => {

        const allowedType = ["image/png", "image/jpg", "image/jpeg"];
        if(!allowedType.includes(data.imageType)){
            logger.warn("Invalid image format provided", {
                id: data
            });

            throw new serverError(errorMessage.INVALIDDATA);
        } 

        const image = await this.methods.create(data);

        logger.info("New image record created", {
            imageId: image.id
        });

        const key = `upload/${Date.now()}-${image.id}-${image.name}`;

        const command = new PutObjectCommand({
            Bucket: config.awsImageBucket,
            Key: key,
            ContentType: data.imageType,
            ChecksumAlgorithm: undefined,
            Metadata: {
                id: image.id
            }  
        })

        const url = getSignedUrl(s3Client, command, { expiresIn: 3600 });

        logger.info("Upload url for image generated",{
            id: image.id
        });

        await redisUtils.invalidateKey(data.resourceId, data.resourceType == "USER" ? "PRIVATE" : "PUBLIC", "CREATE");

        return url;
    }

}

export { ImageService }