import { errorMessage } from "../constants/error.messages.js";
import { prisma } from "../db/prisma.js"
import type { User } from "../dto/user.dto.js";
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
    create = async (data: any) => {
        return await prisma.$transaction(async (tx) => {
                const user = await tx.users.create({
                    data: {
                        email: data.email,
                        username: data.username,
                        password: data.password,
                        auth_provider: "default",
                        role: Role.USER,
                        verified: false
                    }
                });

                if(user.role == "USER") {
                    await tx.user_profiles.create({
                        data: {
                            user_id: user.id,
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
    getByUsername = async (username: string) => {
        const user = await prisma.users.findMany({
            where : {
                username: username,
                deleted_at: null
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
    getById = async (id: string) => {
        const user = await prisma.users.findMany({
            where: {
                id: id,
                deleted_at: null
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
    updateProfile = async ( id: string, data: any ) => {
        return await prisma.$transaction(async (tx) => {
                const profiles = await tx.user_profiles.findMany({
                    where: {
                        user_id: id
                    }
                });
                if(!profiles[0]){
                    logger.warn("No user profile found");
                    logger.info("Creating new user profile");
                    
                    const profile = await tx.user_profiles.create({
                        data: {
                            user_id : id,
                            name: data.name,
                            bio: data.bio,
                            avatar_url: data.avatar_url,
                            skills_summary: data.skills_summary,
                            interests: data.interests
                        }
                    });

                    return profile;
                }

                const profile = await tx.user_profiles.update({
                    where: {
                        user_id: id
                    },
                    data: {
                        name: data.name,
                        bio: data.bio,
                        avatar_url: data.avatar_url,
                        skills_summary: data.skills_summary,
                        interests: data.interests
                    }
                });

                return profile;
        })
    }

}

export { UserRepository }