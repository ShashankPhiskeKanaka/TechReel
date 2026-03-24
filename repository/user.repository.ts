import { errorMessage } from "../constants/error.messages.js";
import { prisma } from "../db/prisma.js"
import type { User, UserData } from "../dto/user.dto.js";
import type { UserProfile, UserProfileData } from "../dto/userProfile.dto.js";
import { Role } from "../generated/prisma/enums.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class UserRepository {

    /**
     * created a new user record in db and based on user role creates user profile record
     * 
     * @param data 
     * @returns 
     */
    create = async (data: UserData) : Promise<User> => {
        return await prisma.$transaction(async (tx) => {
                const user = await tx.users.create({
                    data: {
                        email: data.email,
                        username: data.username,
                        password: data.password,
                        authProvider: "default",
                        role: Role.USER,
                        verified: false
                    }
                });

                if(user.role == "USER") {
                    await tx.user_profiles.create({
                        data: {
                            userId: user.id,
                            interests: {}
                        }
                    });
                }

                return user;
        })
    }

    /**
     * fetches user based on username, performs soft delete check
     * 
     * @param username 
     * @returns 
     */
    getByUsername = async (username: string) : Promise<User> => {
        const user = await prisma.users.findMany({
            where : {
                username: username,
                deletedAt: null
            }
        });

        return user[0] ?? <User>{};
    }

    /**
     * fetches user based on id, performs soft delete check and includes user profile when fetching data
     * 
     * @param id 
     * @returns 
     */
    getById = async (id: string) : Promise<User> => {
        const user = await prisma.users.findMany({
            where: {
                id: id,
                deletedAt: null
            },
            include: {
                profile : true
            }
        });

        return user[0] ?? <User>{};
    }

    /**
     * updates the verified field of the user, validates user existence
     * 
     * @param id 
     * @returns 
     */
    verified = async (id: string) => {
        return await prisma.$transaction(async (tx) => {
            const data = await tx.$queryRaw<any>`
                SELECT * FROM users
                WHERE ( id = ${id} ) AND ( deleted_at IS NULL )
                FOR UPDATE 
            `

            if(!data[0]){
                logger.warn("No user found", {
                    userId: id
                });
                throw new serverError(errorMessage.NOTFOUND);
            }
            await tx.users.update({
                data : {
                    verified: true,
                },
                where : {
                    id: id
                }
            });

            return;
        })
    }

    /**
     * Updates user profile data, validates profile existence
     * 
     * @param id 
     * @param data 
     * @returns 
     */
    updateProfile = async ( id: string, data: UserProfileData ) : Promise<UserProfile> => {
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
                    skills_summary: data.skillsSummary ?? "",
                    interests: data.interests ?? [],
                },
            });

            logger.info("User profile synchronized", { 
                userId: id, 
                fieldsUpdated: Object.keys(updateData) 
            });

            return profile;
    };


}

export { UserRepository }