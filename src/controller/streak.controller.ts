import type { Request, Response } from "express";
import type { StreakService } from "../service/streak.service.js";
import { BaseController } from "./base.controller.js";
import { logger } from "../utils/logger.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("Streak");

class StreakController {
    constructor(private service: StreakService) { }

    /**
     * Initializes a new activity streak for the authenticated user.
     * Starts the current and longest streak counters at 1.
     * @param req - Express Request (user: id)
     * @param res - Express Response (json: initialized streak record)
     */
    create = async (req: Request, res: Response) => {
        logger.http(controllerMessages.CREATE.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const streak = await this.service.create({ userId: req.user?.id ?? "", currentStreak: 1, longestStreak: 1 });

        return ApiResponse.success(res, controllerMessages.CREATE.res, streak);
    }

    /**
     * Increments or resets the user's active streak based on their last activity timestamp.
     * Logic for "today vs yesterday" validation is handled in the service layer.
     * @param req - Express Request (user: id)
     * @param res - Express Response (json: updated streak record)
     */
    update = async (req: Request, res: Response) => {
        logger.http(controllerMessages.UPDATE.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const streak = await this.service.update(req.user?.id ?? "");

        return ApiResponse.success(res, controllerMessages.UPDATE.res, streak);
    }

    /**
     * Retrieves a specific streak record by its unique ID.
     * @param req - Express Request (params: id)
     * @param res - Express Response (json: streak record)
     */
    fetch = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCH.req, {
            ip: req.ip,
            id: req.params.id?.toString()
        });

        const streak = await this.service.fetch(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, controllerMessages.FETCH.res, streak);
    }

    /**
     * Handles the retrieval of all streak records with cursor-based pagination.
     * Supports filtering by specific userId and sorting.
     * @param req - Express Request (query: limit, sort, search, id, createdAt)
     * @param res - Express Response (json: paginated streak records)
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

    /**
     * Removes a streak record from the system.
     * Supports soft or hard deletion via the provided flag.
     * @param req - Express Request (params: id, body: flag)
     * @param res - Express Response (json: success message)
     */
    delete = async (req: Request, res: Response) => {
        logger.http(controllerMessages.DELETE.req, {
            ip: req.ip
        });

        const streak = await this.service.delete(req.params.id?.toString() ?? "", req.body.flag);

        return ApiResponse.success(res, controllerMessages.DELETE.res, streak);
    }
}

export { StreakController }