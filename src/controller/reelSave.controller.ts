import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ReelSaveService } from "../service/reelSave.service.js";
import { logger } from "../utils/logger.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("REEL-SAVE");

class ReelSaveController extends BaseController<ReelSaveService> {
    constructor(service: ReelSaveService) {
        super(service, "REEL-SAVE");
    }

    /**
     * Handles the http request to save reel
     * 
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns {Promise<Response>} 200 Created with the resulting data.
     */
    create = async (req: Request, res: Response) => {
        logger.http(controllerMessages.CREATE.req, {
            ip: req.ip,
            userId: req.user?.id
        });
        const result = await this.service.create({ ...req.body, userId: req.user?.id ?? "" });
        return ApiResponse.success(res, this.messages.CREATE.res, result);
    }

    fetchAll = async (req: Request, res: Response) => {

        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const reels = await this.service.fetchAll(
            this.getPagination(req),
            {
                userId: req.user?.role == "ADMIN" ? req.query.userId?.toString() : req.user?.id,
                reelId: req.query.reelId?.toString(),
                folderId: req.query.folderId?.toString(),
            },
            [
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, reels);
    }
  
}

export { ReelSaveController }