import type { XpData, Xp } from "../dto/xp.dto.js";
import type { XpRepository } from "../repository/xp.repository.js";
import { logger } from "../utils/logger.js";
import { client, pubClient } from "../../caching/redis.client.js";
import { BaseService } from "./base.service.js";
import { redisUtils } from "../utils/redis.utils.js";

class XpService extends BaseService<Xp, XpData, any>{
    constructor(methods: XpRepository) {
        super(methods, "XP");
    }

    /**
     * Grants Experience Points (XP) to a user and logs the transaction.
     * @param data - The XP amount and metadata (action type, category).
     * @param client - The user context or identifier receiving the points.
     * @returns The created XP ledger record.
     * @throws {Error} If the XP cannot be persisted or the user is invalid.
     */
    awardXp = async (data: XpData, dbclient: any) => {
        const xp = await this.methods.awardXp(data, dbclient);

        logger.info("Xp awarded to the user", {
            xpId: xp.id,
            userId: xp.userId
        })

        const now = new Date();
        const dailyKey = `lb:daily:${now.toISOString().split("T")[0]}`;
        const monthlyKey = `lb:monthly:${now.getFullYear()}-${now.getMonth() + 1}`;

        await redisUtils.updateLeaderboard(dailyKey, monthlyKey, data.amount, data.userId);

        await client.expire(dailyKey, 60*60*24*31);

        await pubClient.publish("lg:updates", JSON.stringify({
            type: "XP_UPDATED",
            userId: data.userId
        }));

        return xp;
    }
}

export { XpService };