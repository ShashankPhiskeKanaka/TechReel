import type { Request, Response } from "express";
import type { StreakService } from "../service/streak.service.js";
import { BaseController } from "./base.controller.js";
import { logger } from "../utils/logger.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("Streak");

class StreakController{
    constructor (private service: StreakService) {}

    create = async (req: Request, res: Response) => {
        logger.http(controllerMessages.CREATE.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const streak = await this.service.create({ userId: req.user?.id ?? "", currentStreak: 1, longestStreak: 1 });

        return ApiResponse.success(res, controllerMessages.CREATE.res, streak);
    } 

    update = async (req: Request, res: Response) => {
        logger.http(controllerMessages.UPDATE.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const streak = await this.service.update(req.user?.id ?? "");

        return ApiResponse.success(res, controllerMessages.UPDATE.res, streak);
    }

    fetch = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCH.req, {
            ip: req.ip,
            id: req.params.id?.toString()
        });

        const streak = await this.service.fetch(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, controllerMessages.FETCH.res, streak);
    }

    /**
     * Handles the retrieval of all streak record.
     * Implements pagination.
     * @param req - Express Request (query: page, limit, search)
     * @param res - Express Response (json: paginated token records)
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const data = await this.service.fetchAll(
            {
                limit: Number(req.query.limit) || undefined,
                sort: req.query.sort?.toString(),
                search: req.query.search?.toString() ?? "",
                lastId: req.query.id?.toString() ?? "",
                lastCreatedAt: req.query.createdAt ? new Date(req.query.createdAt.toString()) : undefined,
            },
            {
                userId: req.query.userId?.toString()
            },
            [
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, data);
    }
}

export { StreakController }