import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Role } from "../dto/user.dto.js";
import { logger } from "./logger.js";
import { serverError } from "./error.utils.js";
import { errorMessage } from "../constants/error.messages.js";

class AuthUtilsClass {
    comparePasswords = async (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword);
    }

    generateAccessToken = (id: string, role: string) => {
        return jwt.sign({ id, role }, process.env.JWTSECRET as string, { expiresIn: "15m" });
    }

    generateForgetToken = (id: string) => {
        return jwt.sign({ id }, process.env.JWTSECRET as string, { expiresIn: "15m" });
    }

    decodeForgetToken = (token: string) => {
        try {
            return jwt.verify(token, process.env.JWTSECRET as string) as { id: string }
        } catch (err) {
            logger.warn("Invalid token provided", {
                token: token
            });

            throw new serverError(errorMessage.INVALIDDATA);
        }

    }

    decodeAccesstoken = (token: string) => {
        try {
            return jwt.verify(token, process.env.JWTSECRET as string) as { id: string, role: Role }
        } catch (err) {
            logger.warn("Invalid token provided", {
                token: token
            });

            throw new serverError(errorMessage.INVALIDDATA);
        }
    }

    hashPassword = async (password: string) => {
        return await bcrypt.hash(password, 10);
    }
}

export { AuthUtilsClass }