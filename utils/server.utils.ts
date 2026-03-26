import type { PaginationData } from "../dto/pagination.dto.js";

class ServerUtils {

    parseFilterValue = (value: any) => {
        if(typeof value == 'string' && value.includes(":")) {
            const [operator, rawValue] = value.split(":");
            const numericValue = Number(rawValue);

            if(['gt', 'gte', 'lt', 'lte'].includes(operator ?? "") && !isNaN(numericValue)) {
                return { [operator ?? ""]: numericValue };
            }
        }

        return value;
    }

    buildWhere = (where: any, filters: {}, data: PaginationData) => {
        Object.entries(filters).forEach(([key, value]) => {
            if (value != undefined && value != null) {
                where[key] = this.parseFilterValue(value);
            }
        })

        where.AND.push({
            ...(data.lastCreatedAt && data.lastId ? [
                {
                    OR: [
                        {
                            createdAt: { lt: data.lastCreatedAt },
                        },
                        {
                            createdAt: data.lastCreatedAt,
                            id: { lt: data.lastId }
                        }
                    ]
                }
            ] : []),
        })

        return where;
    }
}

const serverUtils = new ServerUtils();

export { serverUtils }