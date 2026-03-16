import type { Request, Response } from "express";
import type { UserService } from "../service/user.service.js";
import { logger } from "../utils/logger.js";

class UserController {
    constructor(private UserService: UserService) {}

    /**
     * Handles the process of creating an user
     * 
     * @param {Request} req - expects username, email and password in body
     * @param {Response} res - returns new created user along with email verification token
     */
    create = async (req: Request, res: Response) => {

        logger.info("User creation process initiated", {
            path: req.path,
            ip: req.ip
        });
        const data = await this.UserService.create(req.body);

        return res.json({
            success: true,
            message: "New User Created",
            data: data.user,
            token: data.emailToken
        });
    }

    verifyEmail = async (req: Request, res: Response) => {
        await this.UserService.verifyEmail(req.params.token?.toString() ?? "");

        return res.json({
            success: true,
            message: "Email verified",
        });
    }
}

export { UserController }