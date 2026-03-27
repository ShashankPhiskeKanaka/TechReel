import { prisma } from "../db/prisma.js";
import type { UserProfile, UserProfileData } from "../dto/userProfile.dto.js";
import { logger } from "../utils/logger.js";
import { BaseRepository } from "./base.repository.js";

class UserProfileRepository extends BaseRepository<UserProfile, UserProfileData, any> {

    constructor() {
        super(prisma.user_profiles, "User profile", {primaryKey: "id"});
    }
    /**
     * Updates user profile data, validates profile existence
     * 
     * @param id 
     * @param data 
     * @returns 
     */
    update = async (data: UserProfileData, id: string): Promise<UserProfile> => {
        const updateData = Object.fromEntries(
            Object.entries({
                name: data.name,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
                skillsSummary: data.skillsSummary,
                interests: data.interests
            }).filter(([_, value]) => value !== undefined)
        );
        const profile = await prisma.user_profiles.upsert({
            where: { userId: id },
            update: updateData,
            create: {
                userId: id,
                name: data.name ?? "New User",
                bio: data.bio ?? "",
                avatarUrl: data.avatarUrl ?? "",
                skillsSummary: data.skillsSummary ?? "",
                interests: data.interests ?? [],
            },
        });

        return profile;
    };

}

export { UserProfileRepository }