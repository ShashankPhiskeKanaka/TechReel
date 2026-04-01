import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import { XpService } from "../service/xp.service.js";
import { logger } from "../utils/logger.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("Xp");

class XpController extends BaseController<XpService> {
    constructor(service: XpService){
        super(service, "Xp");
    }

    /**
     * Retrieves a paginated list of xp ledger records.
     * Supports specific filtering by user ID.
     * @param req - Express Request (query: page, limit, userId, reelId)
     * @param res - Express Response (json: paginated view records)
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const views = await this.service.fetchAll(
            this.getPagination(req),
            {
                userId: req.user?.role == "ADMIN" ? req.query.userId?.toString() : req.user?.id
            },
            [
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, views);
    }

}

export { XpController }