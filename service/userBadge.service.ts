import type { UserBadgeData, UserBadge } from "../dto/badge.dto.js";
import type { UserBadgesRepository } from "../repository/userBadge.repository.js";
import { BaseService } from "./base.service.js";

class UserBadgeService extends BaseService<UserBadge, UserBadgeData, any> {
    constructor( methods: UserBadgesRepository ) {
        super(methods, "User badge");
    }

    awardBadge = async (data: UserBadgeData, client: any) => {
        await this.methods.awardBadge(data, client);

        return;
    }
}

export { UserBadgeService }