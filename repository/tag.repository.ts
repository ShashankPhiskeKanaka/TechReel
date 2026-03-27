import { prisma } from "../db/prisma.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { Tag } from "../dto/tags.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class TagRepository extends BaseRepository<Tag, any, any> {
    // /**
    //  * Creates a new tag record.
    //  * @param {string} name - The unique name of the tag.
    //  * @returns {Promise<Tag>} The newly created tag.
    //  */
    // create = async (name: string) : Promise<Tag> => {
    //     const tag = await prisma.tags.create({
    //         data: {
    //             name
    //         }
    //     });

    //     return tag;
    // }

    // /**
    //  * Retrieves a tag by its unique identifier.
    //  * @param {string} id - The ID of the tag to fetch.
    //  * @returns {Promise<Tag>} The tag object, or an empty object if not found.
    //  */
    // fetch = async (id: string) : Promise<Tag> => {
    //     const tag = await prisma.tags.findUnique({
    //         where: {
    //             id
    //         }
    //     });

    //     return tag ?? <Tag> {};
    // }

    // /**
    //  * Retrieves a paginated list of tags with optional case-insensitive name search.
    //  * @param {PaginationData} data - Pagination and search parameters.
    //  * @param {Object} filters - Key-value pairs for additional filtering.
    //  * @returns {Promise<Tag[]>} A list of matching tags.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<Tag[]> => {
    //     let where: any = {
    //         AND: []
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const tags = await prisma.tags.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             { createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' },
    //             { id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return tags;
    // }

    // /**
    //  * Permanently deletes a tag record from the database.
    //  * @param {string} id - The ID of the tag to remove.
    //  * @returns {Promise<Tag>} The deleted tag record.
    //  */
    // delete = async (id: string) : Promise<Tag> => {
    //     const tag = await prisma.tags.delete({
    //         where: {
    //             id
    //         }
    //     });

    //     return tag;
    // }
}

export { TagRepository };