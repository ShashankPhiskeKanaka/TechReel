import { Action, Resource } from "../dto/redis.dto.js";
import type { UserProfileData, UserProfile } from "../dto/userProfile.dto.js";
import type { UserProfileRepository } from "../repository/userProfile.repository.js";
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";
import { BaseService } from "./base.service.js";

class UserProfileService extends BaseService<UserProfile, UserProfileData, any> {

    constructor(methods: UserProfileRepository) {
        super(methods, "USER-PROFILE");
    }

    // /**
    //  * updates profile data
    //  * 
    //  * @param id 
    //  * @param data 
    //  * @returns 
    //  */
    // updateProfile = async (id: string, data: any) => {
    //     const profile = await this.UserProfileMethods.updateProfile(id, data);

    //     logger.info("User profile updated successfully", {
    //         userId: id,
    //         profileId: profile.id
    //     });

    //     await redisUtils.invalidateKey(id, Resource.USER, Action.UPDATE);

    //     return profile;
    // }

}

export { UserProfileService }