import type { Request, Response } from "express";
import type { AuthService } from "../service/auth.service.js";
import type { user } from "../dto/auth.dto.js";
import { serverError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.messages.js";

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

        if(req.cookies.refreshToken) {
            return res.json({
                success: true,
                message: "Already logged in"
            });
        }

        const { accessToken, refreshToken } = await this.AuthService.login(req.body.username, req.body.password);

        res.cookie("accessToken", accessToken, { sameSite: "strict", httpOnly: true, maxAge: 15*60*1000 });
        res.cookie("refreshToken", refreshToken, { sameSite: "strict", httpOnly: true, maxAge: 7*24*60*60*1000 });

        return res.json({
            success: true,
            message: "Logged in"
        });
    }

    /**
     * Handles the process of creating credentials for OAuth Clients
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    SignIn = async (req: Request, res: Response) => {
        try{
            const user = req.user as Express.User;

            if(!user) {
                throw new serverError(errorMessage.UNAUTHORIZED);
            }

            const { accessToken, refreshToken } = await this.AuthService.generateNewCredentials(user);

            res.cookie("accessToken", accessToken, { sameSite: "strict", httpOnly: true, maxAge: 15*60*1000});
            res.cookie("refreshToken", refreshToken, { sameSite: "strict", httpOnly: true, maxAge: 7*24*60*60*1000 });

            return res.json({
                success: true,
                message: "Signed in"
            });
        }catch(err : any) {
            throw new serverError({ status: err.status, message: err.message });
        }
    }

    /**
     * 
     * @param {Request} req - expects user from request, flag from parameters, refreshToken from cookies 
     * @param {Response} res - cleared cookies
     */
    logout = async (req: Request, res: Response) => {
        if(!req.cookies.refreshToken) {
            return res.json({
                success: true,
                message: "Already logged out"
            });
        }

        if(!req.user) throw new serverError(errorMessage.UNAUTHORIZED);

        await this.AuthService.logout(req.user , req.params.flag?.toString() == "true" ? true : false, req.cookies.refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.json({
            success: true,
            message: "Logged out"
        });
    }
}

export { AuthController }