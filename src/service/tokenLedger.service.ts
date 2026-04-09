import type { TokenLedger, TokenLedgerData } from "../dto/token.dto.js";
import type { TokenLedgerRepository } from "../repository/tokenLedger.repository.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";

class TokenLedgerService extends BaseService<TokenLedger, TokenLedgerData, any> {
    constructor(methods: TokenLedgerRepository) {
        super(methods, "TOKEN-LEDGER");
    }

    /**
     * Records a new token transaction in the ledger for a specific user.
     * @param data - The token amount and transaction metadata (reason/type).
     * @param client - The target user or account receiving the tokens.
     * @returns The newly created transaction record from the ledger.
     * @throws {Error} If the ledger entry cannot be created or user is invalid.
     */
    awardToken = async (data: TokenLedgerData, client: any) => {
        const tokenLedger = await this.methods.awardToken(data, client);

        logger.info("Token awarded to the user", {
            tokenLedgerId: tokenLedger.id,
            userId: tokenLedger.userId
        });

        return tokenLedger;
    }
}

export { TokenLedgerService };