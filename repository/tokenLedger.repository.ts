import { prisma } from "../db/prisma.js";
import type { TokenLedger, TokenLedgerData } from "../dto/token.dto.js";
import { TransactionType } from "../generated/prisma/enums.js";

class TokenLedgerRepository {
    create = async (data: TokenLedgerData) : Promise<TokenLedger> => {
        const tokenLedger = await prisma.token_ledger.create({
            data: data
        });

        return tokenLedger;
    }

    fetch = async (id: string): Promise<TokenLedger> => {
        const tokenLedger = await prisma.token_ledger.findFirst({
            where: {
                id: id
            }
        });

        return tokenLedger ?? <TokenLedger>{};
    }

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

    delete = async (id: string) => {
        const token = await prisma.token_ledger.delete({
            where: {
                id: id
            }
        });

        return token;
    }
}

export { TokenLedgerRepository }