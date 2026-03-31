import type { Request, Response } from "express";
import type { UserService } from "../service/user.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { errorMessage } from "../constants/error.messages.js";
import { serverError } from "../utils/error.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";

const controllerMessages = new ControllerMessages("User");

class UserController extends BaseController<UserService> {
    constructor(service: UserService) {
        super(service, "User");
    }

    // /**
    //  * Handles the process of creating an user
    //  * 
    //  * @param {Request} req - expects username, email and password in body
    //  * @param {Response} res - returns new created user along with email verification token
    //  */
    // create = async (req: Request, res: Response) => {

    //     logger.http("User creation request recieved", {
    //         path: req.path,
    //         ip: req.ip,
    //         idempotencyKey: req.headers['x-idempotency-key'] ?? "NA"
    //     });

    //     const data = await this.UserService.create(req.body);

    //     return res.json({
    //         success: true,
    //         message: "New User Created",
    //         data: data.user,
    //         token: data.emailToken
    //     });
    // }

    /**
     * Handles the process of email verification
     * 
     * @param {Request} req - expects the email token in request parameters 
     * @param {Response} res - success message
     */
    verifyEmail = async (req: Request, res: Response) => {

        logger.http("Email verification request recieved", {
            ip: req.ip,
            token: req.params.token?.toString() ?? "NA",
            idmepotencyKey: req.headers['x-idempotency-key'] ?? "NA"
        });

        await this.service.verifyEmail(req.params.token?.toString() ?? "");

        return ApiResponse.success(res, "Email verified");
    }

    // /**
    //  * Handles the process of fetching an user based on id
    //  * 
    //  * @param req - expects id from user data in request
    //  * @param res - fetched user data along with success message
    //  */
    // fetch = async (req: Request, res: Response) => {

    //     logger.http("Fetch user by id request received", {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA",
    //     });

    //     const user = await this.UserService.fetch(req.user?.id ?? "");

    //     return ApiResponse.success(res, "User fetched", user);
    // }

    /**
     * Handles the HTTP request to retrieve a paginated list of tokens.
     * Includes a case-insensitive search filter on the token "name" field.
     * @param {Request} req - Express request; expects pagination and search query.
     * @param {Response} res - Express response object.
     * @returns {Promise<Response>} API success response with a list of matching tokens.
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const tokens = await this.service.fetchAll(
            this.getPagination(req),
            {
            },
            [
                "name"
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, tokens);
    }

    /**
     * Handles the HTTP request to delete a token record with ownership validation.
     * Restricts deletion to admins or the token owner, preventing unauthorised removal.
     * @param {Request} req - Express request; expects 'id' in params and 'flag' in body.
     * @param {Response} res - Express response object.
     * @returns {Promise<Response>} API success response confirming the deletion.
     * @throws {serverError} UNAUTHORIZED if the user lacks sufficient permissions.
     */
    delete = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.DELETE.req, { id });

        if (req.user?.role != "ADMIN" && req.user?.id != id) {
            logger.warn("Unauthorized request");

            throw new serverError(errorMessage.UNAUTHORIZED);
        }

        const result = await this.service.delete(req.body.flag, id);

        return ApiResponse.success(res, this.messages.DELETE.res, result);
    }
    // /**
    //  * Handles the HTTP request to delete a user profile.
    //  * 
    //  * @param {Request} req - Express request; expects 'id' in path params, 'flag' (soft/hard) in body, and idempotency key in headers.
    //  * @param {Response} res - Express response; returns the deleted user metadata.
    //  * @returns {Promise<Response>} A standardized API response.
    //  * @throws {ServerError} 403 (Unauthorized) if the caller is not an Admin or the profile owner.
    //  */
    // delete = async (req: Request, res: Response) => {
    //     logger.http("User profile delete request received", {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA",
    //         idmepotencyKey: req.headers['x-idempotency-key'] ?? "NA"
    //     });

    //     if(req.user?.role != "ADMIN" || req.user?.id != req.params.id?.toString()) {
    //         logger.warn(errorMessage.UNAUTHORIZED.message, {
    //             ip: req.ip,
    //             userId: req.user?.id
    //         });

    //         throw new serverError(errorMessage.UNAUTHORIZED);
    //     }

    //     const user = await this.UserService.delete(req.body.flag, req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, "User deleted", user);
    // }

}

export { UserController }