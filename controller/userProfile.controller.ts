import type { Request, Response } from "express";
import type { UserProfileService } from "../service/userProfile.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";

const controllerMessages = new ControllerMessages("User Profile");

class UserProfileController extends BaseController<UserProfileService> {
    constructor (service: UserProfileService) {
        super(service, "User profile");
    }

    /**
     * Retrieves a paginated list of user profiles.
     * Supports search functionality across 'name' and 'bio' fields.
     * @param req - Express Request (query: page, limit, search)
     * @param res - Express Response (json: paginated profiles)
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const userProfiles = await this.service.fetchAll(
            this.getPagination(req),
            {
            },
            [
                "name",
                "bio"
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, userProfiles);
    }

    /**
     * Updates a specific user profile.
     * Includes an authorization check to ensure only Admins or the profile 
     * owner can modify the data.
     * @param req - Express Request (params: id, body: updateData, user: identity/role)
     * @param res - Express Response (json: updated profile)
     * @throws {unauthorizedError} If a non-admin attempts to update another user's profile.
     */
    update = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.UPDATE.req, { id });
        
        if(req.user?.role != "ADMIN" && id != req.user?.id) {
            logger.warn("Unauthorized request", {
                ip: req.ip,
                userId: req.user?.id
            })
        }

        const result = await this.service.update(req.body, id);

        return ApiResponse.success(res, this.messages.UPDATE.res, result);
    }

    /**
     * Performs a soft or hard delete of a user profile record.
     * @param req - Express Request (params: id)
     * @param res - Express Response (json: deletion status)
     */
    delete = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.DELETE.req, { id });

        const result = await this.service.delete(id, true);

        return ApiResponse.success(res, this.messages.DELETE.res, result);
    }

    // /**
    //  * Handles the process of updating user profile
    //  * 
    //  * @param {Request} req - expects user id from user data in request and data to update from body 
    //  * @param {Response} res - updated user profile along with success message
    //  * @returns 
    //  */
    // updateProfile = async (req: Request, res: Response) => {

    //     logger.http(controllerMessages.UPDATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA",
    //         idmepotencyKey: req.headers['x-idempotency-key'] ?? "NA"
    //     });

    //     const profile = await this.service.updateProfile(req.user?.id ?? "", req.body);

    //     return ApiResponse.success(res, controllerMessages.UPDATE.res, profile);
    // }
}

export { UserProfileController }