import type { NextFunction, Request, Response } from "express";
import { serverError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.messages.js";
import { authUtils } from "../factory/auth.factory.js";
import { AuthRepository } from "../repository/auth.repository.js";
import { AuthService } from "../service/auth.service.js";
import { UserRepository } from "../repository/user.repository.js";
import { logger } from "../utils/logger.js";

const repo = new AuthRepository();
const userRepo = new UserRepository();
const service = new AuthService(repo, userRepo);

const authenticate = async (req: Request, res: Response, next: NextFunction) => {4

    if(req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    if(!req.cookies.refreshToken){
        logger.warn("User unauthorized", {
            ip: req.ip
        });
        throw new serverError(errorMessage.UNAUTHORIZED);
    }
    if(!req.cookies.accessToken) {

        logger.info("No access token found, creating new credentials", {
            ip: req.ip
        });

        const { accessToken, refreshToken } = await service.generateCredentials(req.cookies.refreshToken);
        res.cookie("accessToken", accessToken, { sameSite: "strict", httpOnly: true, maxAge: 15*60*1000 });
        res.cookie("refreshToken", refreshToken.id, { sameSite: "strict", httpOnly: true, maxAge: 7*24*60*60*1000 });

        req.user = { id: refreshToken.user_id, role: refreshToken.role  };

        logger.info("New user credentials generated", {
            ip: req.ip,
            userId: refreshToken.user_id,
            role: refreshToken.role
        });

        return next();
    }

    const { id, role } = authUtils.decodeAccesstoken(req.cookies.accessToken);
    if(!id || !role) {
        throw new serverError(errorMessage.UNAUTHORIZED);
    }
    req.user = { id, role };

    return next();
}

export { authenticate, service as AuthService }