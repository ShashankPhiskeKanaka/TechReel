import { errorMessage } from "../constants/error.messages.js";
import { authUtils } from "../factory/auth.factory.js";
import type { UserRepository } from "../repository/user.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class UserService {
    constructor(private UserMethods: UserRepository) {}

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

    verifyEmail = async (token: string) => {
        const { id } = authUtils.decodeForgetToken(token);
        await this.UserMethods.verified(id);

        return;
    }
}

export { UserService }