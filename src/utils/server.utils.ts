import type { PaginationData } from "../dto/pagination.dto.js";

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
        // 1. Initialize AND with your existing baseWhere conditions (like deletedAt: null)
        const AND: any[] = [{ ...baseWhere }];

        // Move existing baseWhere keys into the AND array to keep them safe
        Object.entries(baseWhere).forEach(([key, value]) => {
            AND.push({ [key]: value });
        });

        // 2. Add dynamic filters (like reelId, userId)
        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value != null && value !== 'undefined' && value !== "") {
                AND.push({ [key]: this.parseFilterValue(value) });
            }
        });

        // 3. Add Search logic (Wrapped in its own OR)
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

        // 4. Add Cursor Pagination logic
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

        // Return a fresh object with the unified AND array
        return { AND };
    };

}

const serverUtils = new ServerUtils();

export { serverUtils }