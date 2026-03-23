import type { Request, Response } from "express";
import type { UserService } from "../service/user.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

class UserController {
    constructor(private UserService: UserService) {}

    /**
     * Handles the process of creating an user
     * 
     * @param {Request} req - expects username, email and password in body
     * @param {Response} res - returns new created user along with email verification token
     */
    create = async (req: Request, res: Response) => {


        logger.http("User creation request recieved", {
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

    /**
     * Handles the process of email verification
     * 
     * @param {Request} req - expects the email token in request parameters 
     * @param {Response} res - success message
     */
    verifyEmail = async (req: Request, res: Response) => {

        logger.http("Email verification request recieved", {
            ip: req.ip,
            token: req.params.token?.toString() ?? "NA"
        });

        await this.UserService.verifyEmail(req.params.token?.toString() ?? "");

        return ApiResponse.success(res, "Email verified");
    }

    /**
     * Handles the process of fetching an user based on id
     * 
     * @param req - expects id from user data in request
     * @param res - fetched user data along with success message
     */
    getById = async (req: Request, res: Response) => {

        logger.http("Fetch user by id request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const user = await this.UserService.getById(req.user?.id ?? "");

        return ApiResponse.success(res, "User fetched", user);
    }

    /**
     * Handles the process of updating user profile
     * 
     * @param {Request} req - expects user id from user data in request and data to update from body 
     * @param {Response} res - updated user profile along with success message
     * @returns 
     */
    updateProfile = async (req: Request, res: Response) => {

        logger.http("User profile update request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const profile = await this.UserService.updateProfile(req.user?.id ?? "", req.body);

        return ApiResponse.success(res, "User profile updated", profile);
    }

}

export { UserController }