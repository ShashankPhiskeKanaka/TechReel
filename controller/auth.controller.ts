import type { Request, Response } from "express";
import type { AuthService } from "../service/auth.service.js";
import type { user } from "../dto/auth.dto.js";
import { serverError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.messages.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

class AuthController {
    constructor ( private AuthService : AuthService ) {}

    /**
     * Handles the process of user login
     * 
     * @param {Request} req - expects username and password in body 
     * @param {Response} res - returns HttpOnly cookies on success
     * @returns 
     */
    login = async (req: Request, res: Response) => {

        logger.http("Login request received", { username: req.body.username });

        if(req.cookies.refreshToken) {
            logger.warn("Login attempted when already authenticated", { username: req.body.username });

            return ApiResponse.success(res, "Already logged in");
        }

        const { accessToken, refreshToken } = await this.AuthService.login(req.body.username, req.body.password);

        res.cookie("accessToken", accessToken, { sameSite: "strict", httpOnly: true, maxAge: 15*60*1000 });
        res.cookie("refreshToken", refreshToken, { sameSite: "strict", httpOnly: true, maxAge: 7*24*60*60*1000 });

        return ApiResponse.success(res, "Logged in");
    }

    /**
     * Handles the process of creating credentials for OAuth Clients
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    SignIn = async (req: Request, res: Response) => {

        logger.http("User sign in with OAuth process initiated", {
            ip: req.ip
        })

            const user = req.user as Express.User;

            if(!user) {
                logger.warn("User failed to authorize", {
                    ip: req.ip
                });
                throw new serverError(errorMessage.UNAUTHORIZED);
            }

            const { accessToken, refreshToken } = await this.AuthService.generateNewCredentials(user);

            res.cookie("accessToken", accessToken, { sameSite: "strict", httpOnly: true, maxAge: 15*60*1000});
            res.cookie("refreshToken", refreshToken, { sameSite: "strict", httpOnly: true, maxAge: 7*24*60*60*1000 });

            return ApiResponse.success(res, "User signed in");
    }

    /**
     * 
     * @param {Request} req - expects user from request, flag from parameters, refreshToken from cookies 
     * @param {Response} res - cleared cookies
     */
    logout = async (req: Request, res: Response) => {

        logger.http("Logout request received", {
            ip: req.ip
        });

        if(!req.cookies.refreshToken) {

            logger.warn("User already logged out", {
                ip: req.ip
            });

            return ApiResponse.success(res, "Already logged out");
        }

        await this.AuthService.logout(req.params.flag?.toString() == "true" ? true : false, req.cookies.refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return ApiResponse.success(res, "Logged out");
    }

    forgetPass = async (req: Request, res: Response) => {
        
        logger.http("Forget password request received", {
            ip: req.ip,
            email: req.params.email?.toString()
        });

        const token = await this.AuthService.forgetPass(req.params.email?.toString() ?? "");

        return ApiResponse.success(res, "Forget password token generated", token);
    }

    changePass = async (req: Request, res: Response) => {
        logger.http("Change password request recieved", {
            ip: req.ip
        });

        await this.AuthService.changePass(req.params.token?.toString() ?? "", req.body.password);

        return ApiResponse.success(res, "Password changed successfully");
    }
}

export { AuthController }