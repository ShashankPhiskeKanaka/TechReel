import type { TokenLedgerData } from "../dto/token.dto.js";
import type { TokenLedgerRepository } from "../repository/tokenLedger.repository.js";

class TokenLedgerService {
    constructor (private TokenLedgerMethods: TokenLedgerRepository) {}

    awardToken = async (data: TokenLedgerData, client: any) => {
        const tokenLedger = await this.TokenLedgerMethods.awardToken(data, client);

        return tokenLedger;
    }
}

export { TokenLedgerService };