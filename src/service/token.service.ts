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

    // fetch = async (id: string) => {
    //     const token = await this.TokenMethods.fetch(id);

    //     if(!token.id) {
    //         logger.warn(serviceMessage.FETCH.error, {
    //             tokenId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info(serviceMessage.FETCH.message, {
    //         tokenId: id
    //     });

    //     return token;
    // }

    // fetchAll = async (data: PaginationData, filters: {}) => {
    //     const tokens = await this.TokenMethods.fetchAll(data, filters);

    //     if(tokens.length == 0) {
    //         logger.warn(serviceMessage.FETCHALL.error);

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info(serviceMessage.FETCHALL.message);

    //     return tokens;
    // }

    // delete = async (id: string, flag: boolean) => {
    //     let token;
    //     if(flag) {
    //         token = await this.TokenMethods.hardDelete(id);
    //         logger.info(serviceMessage.DELETE.hardDelete, {
    //             tokenId: id
    //         });
    //     }else{
    //         token = await this.TokenMethods.softDelete(id);
    //         logger.info(serviceMessage.DELETE.softDelete, {
    //             tokenId: id
    //         });
    //     }

    //     return token;
    // }

}

export { TokenService }