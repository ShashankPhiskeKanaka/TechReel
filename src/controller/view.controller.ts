import type { Request, Response } from "express";
import type { ViewService } from "../service/view.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";

const controllerMessages = new ControllerMessages("View");

class ViewController extends BaseController<ViewService> {
    constructor(service: ViewService) {
        super(service, "View");
    }

    /**
     * Handles the HTTP request to record a new reel view.
     * 
     * @param {Request} req - Express request; expects view details in body and userId from session.
     * @param {Response} res - Express response; returns the created view record and success status.
     * @returns {Promise<Response>} A standardized API response containing the view metadata.
     */
    createView = async (req: Request, res: Response) => {
        logger.http(controllerMessages.CREATE.req, {
            userId: req.user?.id ?? "",
            reelId: req.body.reelId,
            ip: req.ip
        });

        await this.service.createView({
            ...req.body,
            userId: req.user?.id ?? ""
        });

        return ApiResponse.success(res, controllerMessages.CREATE.res);
    }

    /**
     * Handles the HTTP request to update a reel view record.
     * 
     * @param {Request} req - Express request; expects `reelId` in body and `userId` from session.
     * @param {Response} res - Express response; returns a 200 status once the job is queued.
     * @returns {Promise<Response>} A standardized API response confirming the request was received.
     */

    updateView = async (req: Request, res: Response) => {
        logger.http(controllerMessages.UPDATE.req, {
            ip: req.ip,
            userId: req.user?.id,
            reelId: req.body.reelId
        });

        await this.service.updateView({ ...req.body, userId: req.user?.id ?? "" });

        return ApiResponse.success(res, controllerMessages.UPDATE.res);
    }

    /**
     * Handles the HTTP request to fetch the total view count for a specific reel.
     * 
     * @param {Request} req - Express request; expects 'id' (reelId) in path parameters.
     * @param {Response} res - Express response; returns the numeric view count.
     * @returns {Promise<Response>} A standardized API response containing the total views.
     */
    fetchViews = async (req: Request, res: Response) => {
        logger.http("Fetch views for reel request received", {
            ip: req.ip,
            reelId: req.params.id?.toString()
        });

        const views = await this.service.fetchViews(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Views fetched for reel", views);
    }

    // /**
    //  * Handles the HTTP request to retrieve a specific view record by its unique ID.
    //  * 
    //  * @param {Request} req - Express request; expects 'id' (viewRecordId) in path params.
    //  * @param {Response} res - Express response; returns the detailed view record metadata.
    //  * @returns {Promise<Response>} A standardized API response containing the view object.
    //  */
    // fetch = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.FETCH.req, {
    //         ip: req.ip,
    //         viewId: req.params.id?.toString(),
    //         userId: req.user?.id
    //     });

    //     const view = await this.ViewService.fetch(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.FETCH.res, view);
    // }

    /**
     * Retrieves a paginated list of video view records.
     * Supports specific filtering by user ID or reel ID to track consumption history.
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
                userId: req.query.userId?.toString(),
                reelId: req.query.reelId?.toString()
            },
            [
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, views);
    }

    // /**
    //  * Handles the HTTP request to delete a specific view record.
    //  * 
    //  * @param {Request} req - Express request; expects 'id' (viewRecordId) in path params.
    //  * @param {Response} res - Express response; returns the metadata of the deleted record.
    //  * @returns {Promise<Response>} A standardized API response confirming the deletion.
    //  */
    // delete = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.DELETE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         viewId: req.params.id?.toString()
    //     });

    //     const view = await this.ViewService.delete(req.body.viewId, req.body.reelId);

    //     return ApiResponse.success(res, controllerMessages.DELETE.res, view);
    // }
}

export { ViewController };