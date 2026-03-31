import { prisma } from "../../db/prisma.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { TokenLedger, TokenLedgerData } from "../dto/token.dto.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import { logger } from "../utils/logger.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class TokenLedgerRepository extends BaseRepository<TokenLedger, TokenLedgerData, any> {

    constructor() {
        super(prisma.token_ledger, "Token ledger");
    }

    /**
     * Awards tokens to a user by creating a ledger entry and updating their balance.
     * Uses an upsert to either increment the existing balance or create a new one.
     * @param {TokenLedgerData} data - The ledger entry details (userId, tokenId, etc.).
     * @param {any} [client=prisma] - Optional Prisma client/transaction instance.
     * @returns {Promise<TokenLedger>} The created ledger record.
     */
    awardToken = async (data: TokenLedgerData, client: any = prisma): Promise<TokenLedger> => {

        const token = await client.tokens.findFirst({
            where: {
                deletedAt: null,
                id: data.tokenId
            }
        });

        if (!token) {
            logger.warn("Token not available", {
                tokenId: data.tokenId
            });
        }

        const tokenLedger = await client.token_ledger.create({
            data
        });

        await client.user_token_balance.upsert({
            where: {
                userId: data.userId,
                tokenId: data.tokenId
            },
            update: {
                amount: {
                    increment: 1
                }
            },
            create: {
                amount: 1,
                userId: data.userId,
                tokenId: data.tokenId
            }
        });

        return tokenLedger;
    }

    // /**
    //   * Retrieves a specific token ledger entry by its unique ID.
    //   * @param {string} id - The ID of the ledger entry.
    //   * @returns {Promise<TokenLedger>} The ledger record or an empty object if not found.
    //   */
    // fetch = async (id: string, userId?: string): Promise<TokenLedger> => {
    //     const tokenLedger = await prisma.token_ledger.findFirst({
    //         where: {
    //             id,
    //             ...(userId ? {userId} : {})
    //         }
    //     });

    //     return tokenLedger ?? <TokenLedger>{};
    // }

    // /**
    //  * Retrieves a paginated list of token ledger entries based on filters.
    //  * @param {PaginationData} data - Pagination and sorting settings.
    //  * @param {Object} filters - Key-value pairs for filtering.
    //  * @returns {Promise<TokenLedger[]>} A list of ledger records.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<TokenLedger[]> => {
    //     let where: any = {
    //         AND: []
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const tokenLedgers = await prisma.token_ledger.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             {createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc'},
    //             {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return tokenLedgers;
    // }

    /**
     * Calculates the total token balance for a user using raw SQL.
     * Subtracts total DEBITS from total CREDITS.
     * @param {string} userId - The unique identifier of the user.
     * @returns {Promise<number>} The calculated balance.
     */
    fetchCount = async (userId: string) => {
        const tokens: any = await prisma.$queryRaw`
            SELECT
                SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END) -
                SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END) as balance
            FROM token_ledger
            WHERE user_id: ${userId}
        `;

        return tokens[0].balance ?? 0;
    }

    // /**
    //  * Permanently deletes a token ledger entry from the database.
    //  * @param {string} id - The ID of the entry to remove.
    //  * @returns {Promise<TokenLedger>} The deleted ledger record.
    //  */
    // delete = async (id: string) => {
    //     const token = await prisma.token_ledger.delete({
    //         where: {
    //             id: id
    //         }
    //     });

    //     return token;
    // }
}

export { TokenLedgerRepository }