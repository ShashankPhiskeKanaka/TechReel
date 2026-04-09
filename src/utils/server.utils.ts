import { PutObjectCommand } from "@aws-sdk/client-s3";
import { errorMessage } from "../constants/error.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { logger } from "./logger.js";
import { config } from "../config/index.js";
import { s3Client } from "../../db/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class ServerUtils {

    parseFilterValue = (value: any) => {
        if (typeof value == 'string' && value.includes(":")) {
            const [operator, rawValue] = value.split(":");
            const numericValue = Number(rawValue);

            if (['gt', 'gte', 'lt', 'lte'].includes(operator ?? "") && !isNaN(numericValue)) {
                return { [operator ?? ""]: numericValue };
            }
        }

        return value;
    }
    buildWhere = (baseWhere: any, filters: any, data: PaginationData, searchFields: string[]) => {
        const AND: any[] = [{ ...baseWhere }];
        Object.entries(baseWhere).forEach(([key, value]) => {
            AND.push({ [key]: value });
        });

        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value != null && value !== 'undefined' && value !== "") {
                AND.push({ [key]: this.parseFilterValue(value) });
            }
        });
        if (data.search && searchFields.length > 0) {
            AND.push({
                OR: searchFields.map((field) => ({
                    [field]: {
                        contains: data.search,
                        mode: "insensitive"
                    }
                }))
            });
        }

        if (data.lastCreatedAt && data.lastId) {
            AND.push({
                OR: [
                    { createdAt: { lt: data.lastCreatedAt } },
                    {
                        AND: [
                            { createdAt: data.lastCreatedAt },
                            { id: { lt: data.lastId } }
                        ]
                    }
                ]
            });
        }
        return { AND };
    };

    generateSignedUrl = async (data: any) => {
        const allowedType = ["image/jpeg", "image/jpg", "image/png"];

        if(!allowedType.includes(data.imageType)) {
            logger.warn("Invalid image format", {

            })
        }

        const key = `uploads/${Date.now()}-${data.id}-${data.name}`;

        const command = new PutObjectCommand({
            Bucket: config.awsImageBucket,
            Key: key,
            ContentType: data.imageType,
            ChecksumAlgorithm: undefined,
            Metadata: {
                imageId: data.id,
            }
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return uploadUrl;  
    }

}

const serverUtils = new ServerUtils();

export { serverUtils }