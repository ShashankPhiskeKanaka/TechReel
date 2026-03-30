import type { XpData } from "../dto/xp.dto.js";
import type { XpRepository } from "../repository/xp.repository.js";
import { logger } from "../utils/logger.js";

class XpService {
    constructor (private XpMethods: XpRepository) {}

    /**
     * Grants Experience Points (XP) to a user and logs the transaction.
     * @param data - The XP amount and metadata (action type, category).
     * @param client - The user context or identifier receiving the points.
     * @returns The created XP ledger record.
     * @throws {Error} If the XP cannot be persisted or the user is invalid.
     */
    awardXp = async (data: XpData, client: any) => {
        const xp = await this.XpMethods.awardXp(data, client);

        logger.info("Xp awarded to the user", {
            xpId: xp.id,
            userId: xp.userId
        })

        return xp;
    }
}

export { XpService };