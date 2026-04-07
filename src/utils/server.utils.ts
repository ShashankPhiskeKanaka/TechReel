import { errorMessage } from "../constants/error.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { logger } from "./logger.js";

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

        
    }

}

const serverUtils = new ServerUtils();

export { serverUtils }