import { prisma } from "../../db/prisma.js"
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { Token, TokenData } from "../dto/token.dto.js"
import { BaseRepository } from "./base.repository.js";

class TokenRepository extends BaseRepository<Token, TokenData, any> {
    constructor() {
        super(prisma.tokens, "Token");
    }

    /**
     * Creates a new token record.
     * @param {TokenData} data - The token data to persist.
     * @returns {Promise<Token>} The newly created token.
     */
    create = async (data: TokenData): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const token = await tx.tokens.create({
                data: {
                    name: data.name,
                    tokenUrl: data.tokenUrl ?? null
                }
            });

            let imageRecord;

            if(data.imageType) {
                imageRecord = await tx.images.create({
                    data: {
                        resourceId: token.id,
                        resourceType: "TOKEN",
                        imageType: data.imageType
                    }
                });
            }

            return { token, imageRecord }; 
        })
    }

    /**
     * Updates an existing active token.
     * @param {TokenData} data - The updated data fields.
     * @param {string} id - The ID of the token to update.
     * @returns {Promise<Token>} The updated token record.
     */
    update = async (data: TokenData, id: string): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            
            const token = await tx.tokens.update({
                where: {
                    id: id,
                    deleted_at: null
                },
                data: {
                    name: data.name,
                    tokenUrl: data.tokenUrl ?? null
                }
            });

            let imageRecord;

            if(data.imageType) {
                imageRecord = await tx.images.update({
                    where: {
                        resourceId: token.id
                    },
                    data: {
                        imageType: data.imageType
                    }
                });
            }

            return {token, imageRecord};
        })
    }

    /**
     * Permanently removes a token record from the database.
     * @param {string} id - The ID of the token to delete.
     * @returns {Promise<Token>} The deleted token record.
     */
    hardDelete = async (id: string): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const token = await tx.tokens.delete({
                where: {
                    id: id
                }
            });

            let imageRecord = await tx.images.delete({
                where: {
                    resourceId: token.id
                }
            });

            return {token, imageRecord};

        })
    }

    // /**
    //  * Retrieves a single active token by its ID.
    //  * @param {string} id - The unique identifier of the token.
    //  * @returns {Promise<Token>} The token object, or an empty object if not found.
    //  */
    // fetch = async (id: string) : Promise<Token> => {
    //     const token = await prisma.tokens.findUnique({
    //         where: {
    //             id: id,
    //             deleted_at : null
    //         }
    //     });

    //     return token ?? <Token>{};
    // }

    // /**
    //  * Retrieves a paginated list of active tokens with case-insensitive name search.
    //  * @param {PaginationData} data - Pagination and search settings.
    //  * @param {Object} filter - Additional filtering criteria.
    //  * @returns {Promise<Token[]>} A list of active tokens matching the search.
    //  */
    // fetchAll = async (data: PaginationData, filter: {}): Promise<Token[]> => {
    //     let where: any = {
    //         deletedAt: null,
    //         AND: [
    //             {
    //                 OR: [
    //                     {
    //                         name: {
    //                             contains: data.search,
    //                             case: 'insensitive'
    //                         }
    //                     }
    //                 ]
    //             }
    //         ]
    //     }

    //     const tokens = await prisma.tokens.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
    //             {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return tokens;
    // }

    // /**
    //  * Marks a token as deleted by setting a deletion timestamp.
    //  * @param {string} id - The ID of the token to soft delete.
    //  * @returns {Promise<Token>} The updated token record.
    //  */
    // softDelete = async (id: string) : Promise<Token> => {
    //     const token = await prisma.tokens.update({
    //         where: {
    //             id: id
    //         },
    //         data: {
    //             deleted_at: new Date()
    //         }
    //     });

    //     return token;
    // }
}

export { TokenRepository }