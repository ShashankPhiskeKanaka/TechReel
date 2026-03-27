import { prisma } from "../db/prisma.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { UserToken, UserTokenData } from "../dto/token.dto.js";
import { BaseRepository } from "./base.repository.js";

class UserTokenRepository extends BaseRepository<UserToken, UserTokenData, any> {

    constructor() {
        super(prisma.user_token_balance, "User token");
    }

    // /**
    //  * Creates a new user token balance record.
    //  * @param {UserTokenData} data - The initial balance data (userId, tokenId, and amount).
    //  * @returns {Promise<UserToken>} The newly created user token balance record.
    //  */
    // create = async (data: UserTokenData): Promise<UserToken> => {
    //     const userTokenBalance = await prisma.user_token_balance.create({
    //         data: data
    //     });

    //     return userTokenBalance;
    // }

    // /**
    //  * Retrieves a specific token balance for a user.
    //  * @param {string} id - The unique ID of the balance record.
    //  * @param {string} userId - The user ID to ensure the record belongs to the correct user.
    //  * @returns {Promise<UserToken>} The token balance record, or an empty object if not found.
    //  */
    // fetch = async (id: string, userId: string): Promise<UserToken> => {
    //     const userTokenBalance = await prisma.user_token_balance.findFirst({
    //         where: {
    //             id,
    //             userId
    //         }
    //     });

    //     return userTokenBalance ?? <UserToken> {};
    // }

    // /**
    //  * Retrieves a paginated list of token balances, optionally filtered by user or specific token.
    //  * @param {PaginationData} data - Pagination and sorting settings.
    //  * @param {Object} filters - Additional filtering criteria.
    //  * @param {string} [userId] - Optional filter to fetch balances for a specific user.
    //  * @param {string} [tokenId] - Optional filter to fetch balances for a specific token type.
    //  * @returns {Promise<UserToken[]>} A list of matching user token balance records.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, userId?: string, tokenId?: string): Promise<UserToken[]> => {

    //     let where: any = {
    //         ...(userId ? {userId} : {}),
    //         ...(tokenId ? {tokenId} : {}),
    //         AND: []
    //     }

    //     const userTokens = await prisma.user_token_balance.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
    //             {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return userTokens;
    // }

    // /**
    //  * Permanently deletes a user's token balance record from the database.
    //  * @param {string} id - The unique ID of the record to remove.
    //  * @returns {Promise<UserToken>} The deleted user token balance record.
    //  */
    // delete = async (id: string): Promise<UserToken> => {
    //     const userTokenBalance = await prisma.user_token_balance.delete({
    //         where: {
    //             id
    //         }
    //     });

    //     return userTokenBalance;
    // }
}

export { UserTokenRepository };