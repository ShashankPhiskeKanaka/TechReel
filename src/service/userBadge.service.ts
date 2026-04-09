import type { UserBadgeData, UserBadge } from "../dto/badge.dto.js";
import type { UserBadgesRepository } from "../repository/userBadge.repository.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";

class UserBadgeService extends BaseService<UserBadge, UserBadgeData, any> {
    constructor(methods: UserBadgesRepository) {
        super(methods, "USER-BADGE");
    }

    /**
     * Assigns a specific badge to a user record.
     * @param data - The badge metadata (badgeId, category, or tier).
     * @param client - The user identifier or account receiving the reward.
     * @returns Promise<void>
     * @throws {Error} If the badge assignment fails or the user is not found.
     */
    awardBadge = async (data: UserBadgeData, client: any) => {
        const {badge, userBadge} = await this.methods.awardBadge(data, client);

        logger.info("Badge awarded to user", {
            userBadgeId: userBadge.id,
            userId: userBadge.userId
        });

        return badge;
    }
}

export { UserBadgeService }