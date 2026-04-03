import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { FolderService } from "../service/folder.service.js";
import { logger } from "../utils/logger.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("FOLDER");

class FolderController extends BaseController<FolderService> {
    constructor(service: FolderService) {
        super(service, "FOLDER");
    }

    /**
     * Handles the http request to create a new folder
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

    /**
     * Handles the HTTP request to retrieve a paginated list of folders.
     * Supports filtering by a specific user
     * @param {Request} req - Express request; expects pagination and optional userId in query.
     * @param {Response} res - Express response object.
     * @returns {Promise<Response>} API success response with a list of like records.
     */
    fetchAll = async (req: Request, res: Response) => {

        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const likes = await this.service.fetchAll(
            this.getPagination(req),
            {
                userId: req.user?.role == "ADMIN" ? req.query.userId?.toString() : req.user?.id
            },
            [
                "name"
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, likes);
    }
}

export { FolderController }