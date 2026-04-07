import { prisma } from "../../db/prisma.js";
import type { UserProfile, UserProfileData } from "../dto/userProfile.dto.js";
import { logger } from "../utils/logger.js";
import { BaseRepository } from "./base.repository.js";

class UserProfileRepository extends BaseRepository<UserProfile, UserProfileData, any> {

    constructor() {
        super(prisma.user_profiles, "User profile", { primaryKey: "id" });
    }
    /**
     * Updates user profile data, validates profile existence
     * 
     * @param id 
     * @param data 
     * @returns 
     */
    update = async (data: any, id: string): Promise<any> => {
        const updateData = Object.fromEntries(
            Object.entries({
                name: data.name,
                bio: data.bio,
                skillsSummary: data.skillsSummary,
                interests: data.interests
            }).filter(([_, value]) => value !== undefined)
        );
        return await prisma.$transaction(async (tx) => {
            const profile = await tx.user_profiles.upsert({
                where: { userId: id },
                update: updateData,
                create: {
                    userId: id,
                    name: data.name ?? undefined,
                    interests: data.interests ?? undefined,
                    bio: data.bio ?? undefined,
                    skillsSummary: data.skillsSummary ?? undefined
                 },
            });

            let imageRecord;
            let oldImageRecord;

            if(data.imageType) {

                try{
                    oldImageRecord = await tx.images.findFirst({
                        where: {
                            resourceId: id
                        }
                    });
                }catch (err) {
                    logger.info("No image record found");
                }

                imageRecord = await tx.images.upsert({
                    where: { resourceId: id },
                    update: { imageType: data.imageType },
                    create: {
                        resourceId: id,
                        resourceType: "USER",
                        imageType: data.imageType
                    }
                });
            }

            return { profile, imageRecord, oldImageRecord };
        })
    };

}

export { UserProfileRepository }