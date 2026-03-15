import { errorMessage } from "../constants/error.messages.js";
import { authUtils } from "../factory/auth.factory.js";
import type { AuthRepository } from "../repository/auth.repository.js";
import type { UserRepository } from "../repository/user.repository.js";
import { serverError } from "../utils/error.utils.js";
import crypto from "crypto";

class AuthService {
    constructor ( private AuthMethods : AuthRepository, private UserMethods: UserRepository) {}

    login = async (username : string, password: string) => {
        const user = await this.UserMethods.getByUsername(username);
        if(!user.id) throw new serverError(errorMessage.INVALIDDATA);

        if(!authUtils.comparePasswords(password, user.password)) throw new serverError(errorMessage.LOGINERROR);

        const accessToken = authUtils.generateAccessToken(user.id, user.role);
        const familyId = crypto.randomUUID();
        const refreshToken = await this.AuthMethods.create(familyId, user.id);

        return { accessToken, refreshToken };
    }
}

export { AuthService }