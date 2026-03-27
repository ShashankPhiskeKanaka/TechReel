import { errorMessage } from "../constants/error.messages.js";
import { ServiceMessages } from "../constants/service.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { Action, Resource } from "../dto/redis.dto.js";
import type { UserUpdateData } from "../dto/user.dto.js";
import { authUtils } from "../factory/auth.factory.js";
import type { UserRepository } from "../repository/user.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";

const serviceMessages = new ServiceMessages("User");

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

        logger.info(serviceMessages.CREATE.message, {
            userId: user.id,
            role: user.role
        });

        await redisUtils.invalidateKey(user.id, Resource.USER, Action.CREATE);

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
    fetch = async (id: string) => {
        const user = await this.UserMethods.fetch(id);
        if(!user.id){
            logger.warn(serviceMessages.FETCH.error, {
                userId: id
            });
            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info(serviceMessages.FETCH.message, {
            userId: id
        });

        return user;
    }
    fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]) => {
        const records = await this.UserMethods.fetchAll(data, filters, searchFields);

        if (records.length == 0) {
            logger.warn(`No user records found`);

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info(`User records fetched`);

        return records;
    }

    update = async (data: UserUpdateData, id: string) => {
        const user = await this.UserMethods.update(data, id);

        logger.info("User record updated", {
            userId: id
        });

        return user;
    }

    /**
     * Orchestrates the deletion of a user profile using either a soft or hard delete strategy.
     * 
     * @param {boolean} flag - If true, permanently removes the user; if false, marks the user as deleted.
     * @param {string} id - The unique identifier (UUID) of the user to be deleted.
     * @returns {Promise<User>} The result of the deletion operation (deleted user record).
     * @throws {Error} If the repository operation fails or the user is not found.
     */
    delete = async (flag: boolean, id: string) => {
        let user;

        if(flag) {
            user = await this.UserMethods.hardDelete(id);
            logger.info("User hard deleted successfully", {
                userId: id
            });
        }else{
            user = await this.UserMethods.softDelete(id);
            logger.info("User soft deleted successfully", {
                userId: id
            });
        }

        await redisUtils.invalidateKey(user.id, Resource.USER, Action.DELETE);
    
        return user;
    }
}

export { UserService }