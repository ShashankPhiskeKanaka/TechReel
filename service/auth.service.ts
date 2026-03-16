import { errorMessage } from "../constants/error.messages.js";
import type { user } from "../dto/auth.dto.js";
import { authUtils } from "../factory/auth.factory.js";
import type { AuthRepository } from "../repository/auth.repository.js";
import type { UserRepository } from "../repository/user.repository.js";
import { serverError } from "../utils/error.utils.js";
import crypto from "crypto";
import { logger } from "../utils/logger.js";

class AuthService {
    constructor ( private AuthMethods : AuthRepository, private UserMethods: UserRepository) {}

    /**
     * Authenticates user credentials and creates a new session family
     * 
     * @param username 
     * @param password 
     * @returns { accessToken, refreshToken }
     */
    login = async (username : string, password: string) => {
        const user = await this.UserMethods.getByUsername(username);
        if(!user.id || !user.verified) throw new serverError(errorMessage.INVALIDDATA);

        if(!authUtils.comparePasswords(password, user.password)) throw new serverError(errorMessage.LOGINERROR);

        const accessToken = authUtils.generateAccessToken(user.id, user.role);
        const familyId = crypto.randomUUID();
        const refreshToken = await this.AuthMethods.create(familyId, user.id, user.role);

        logger.info("User logged in successfully", {
            userId: user.id,
            role: user.role
        });

        return { accessToken, refreshToken : refreshToken.id };
    }

    /**
     * Generated new refreshToken and accessToken, validates old refreshToken
     * 
     * @param refreshToken 
     * @returns 
     */
    generateCredentials = async (refreshToken : string) => {
        const refreshTokenData = await this.AuthMethods.generateNewToken(refreshToken);
        if(!refreshTokenData.id) throw new serverError(errorMessage.UNAUTHORIZED);
        const accessToken = authUtils.generateAccessToken(refreshTokenData.user_id, refreshTokenData.role);

        logger.info("New refreshToken and accessToken created for user", {
            userId: refreshTokenData.user_id
        });

        return { accessToken, refreshToken : refreshTokenData };     
    }

    generateNewCredentials = async (user: user) => {
        const accessToken = authUtils.generateAccessToken(user.id, user.role);
        const familyId = crypto.randomUUID();
        const refreshToken = await this.AuthMethods.create(familyId, user.id, user.role);

        logger.info("New refreshToken and accessToken created for user", {
            userId: refreshToken.user_id
        });

        return { accessToken, refreshToken : refreshToken.id };     
    }

    /**
     * Deletes refreshTokens based on flag, if true then delete token based on userId and if false then delete based on familyId
     * 
     * @param user 
     * @param flag 
     * @param refreshToken 
     * @returns 
     */
    logout = async (user: user, flag: boolean, refreshToken: string) => {
        if(flag) {
            await this.AuthMethods.deleteByUser(user.id, refreshToken);
        }else{
            await this.AuthMethods.deleteByFamily(refreshToken);
        }

        logger.info("User logged out successfully", {
            userId: user.id,
            role: user.role
        });

        return;
    }
}

export { AuthService }