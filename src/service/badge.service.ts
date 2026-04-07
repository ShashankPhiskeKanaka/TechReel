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

    // /**
    //  * Creates a new badge and logs the operation.
    //  * @param {BadgeData} data - The badge information to be created.
    //  * @returns {Promise<Badge>} The created badge record.
    //  */
    // create = async (data: BadgeData) => {
    //     const badge = await this.BadgeMethods.create(data);

    //     logger.info("New badge created", {
    //         badgeId: badge.id
    //     });

    //     return badge;
    // }

    // /**
    //  * Fetches a badge by ID and throws a 404 error if not found.
    //  * @param {string} id - The unique identifier of the badge.
    //  * @returns {Promise<Badge>} The found badge.
    //  * @throws {serverError} NOTFOUND if the badge record is empty or invalid.
    //  */
    // fetch = async (id: string) => {
    //     const badge = await this.BadgeMethods.fetch(id);

    //     if(!badge.id) {
    //         logger.warn("No badge found with the id", {
    //             badgeId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info("Badge fetched with id", {
    //         badgeId: id
    //     });

    //     return badge;
    // }

    // /**
    //  * Retrieves a paginated list of all badges based on filters.
    //  * @param {PaginationData} data - Pagination settings (limit, sort, search).
    //  * @param {Object} filters - Filtering criteria.
    //  * @returns {Promise<Badge[]>} A list of badges.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}) => {
    //     const badges = await this.BadgeMethods.fetchAll(data, filters);

    //     logger.info("Badges fetched");

    //     return badges;
    // }

    // /**
    //  * Updates an existing badge record and logs the change.
    //  * @param {any} data - The updated badge fields, including badgeId.
    //  * @returns {Promise<Badge>} The updated badge record.
    //  */
    // update = async (data: any) => {
    //     const badge = await this.BadgeMethods.update(data);

    //     logger.info("Badge updated", {
    //         badgeId: data.badgeId
    //     });

    //     return badge;
    // }

    // /**
    //  * Deletes a badge using either a soft or hard delete strategy based on the flag.
    //  * @param {string} id - The ID of the badge to delete.
    //  * @param {boolean} flag - If true, performs a hard delete; otherwise, a soft delete.
    //  * @returns {Promise<Badge>} The deleted or updated badge record.
    //  */
    // delete = async (id: string, flag: boolean) => {
    //     let badge;

    //     if(flag) {
    //         badge = await this.BadgeMethods.hardDelete(id);
    //         logger.info("Badge hard deleted", {
    //             badgeId: id
    //         });
    //     }else{
    //         badge = await this.BadgeMethods.softDelete(id);
    //         logger.info("Badge soft deleted", {
    //             badgeId: id
    //         });
    //     }

    //     return badge;
    // }
}

export { BadgeService }