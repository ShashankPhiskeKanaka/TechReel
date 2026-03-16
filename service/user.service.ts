import { errorMessage } from "../constants/error.messages.js";
import { authUtils } from "../factory/auth.factory.js";
import type { UserRepository } from "../repository/user.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class UserService {
    constructor(private UserMethods: UserRepository) {}

    /**
     * Hashed user password, generated email verification token and creates user
     * 
     * @param data 
     * @returns 
     */
    create = async (data : any) => {
        const hashedPassword = await authUtils.hashPassword(data.password);
        const user = await this.UserMethods.create({
            ...data,
            password: hashedPassword
        });

        const emailToken = authUtils.generateForgetToken(user.id);

        logger.info("User created successfully", {
            userId: user.id,
            role: user.role
        });

        return { user, emailToken };
    }

    /**
     * Verifies the provided email verification token and updates the user
     * 
     * @param token 
     * @returns 
     */
    verifyEmail = async (token: string) => {
        const { id } = authUtils.decodeForgetToken(token);
        await this.UserMethods.verified(id);

        logger.info("Email verified successfully", {
            userId: id
        });

        return;
    }

    /**
     * Fetches user based on id, validates fetched data
     * 
     * @param id 
     * @returns 
     */
    getById = async (id: string) => {
        const user = await this.UserMethods.getById(id);
        if(!user.id) throw new serverError(errorMessage.NOTFOUND);

        logger.info("User fetched successfully using Id", {
            userId: id
        });

        return user;
    }

    /**
     * updates profile data
     * 
     * @param id 
     * @param data 
     * @returns 
     */
    updateProfile = async ( id: string, data: any ) => {
        const profile = await this.UserMethods.updateProfile(id, data);

        logger.info("User profile updated successfully", {
            userId: id,
            profileId: profile.id
        });

        return profile;
    }
}

export { UserService }