import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { UserBadgeService } from "../service/userBadge.service.js";
import { logger } from "../utils/logger.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";


const controllerMessages = new ControllerMessages("USER-BADGE")
class UserBadgeController extends BaseController<UserBadgeService> {
    constructor(service: UserBadgeService) {
        super(service, "USER-BADGE");
    }

    /**
     * Retrieves a paginated list of user badges.
     * Supports filtering across fields like userId and badgeId
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
                userId: req.user?.role === "ADMIN" ? req.query.userId?.toString() : req.user?.id,
                badgeId: req.query.badgeId?.toString()
            },
            [
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, userProfiles);
    }  
}

export { UserBadgeController }