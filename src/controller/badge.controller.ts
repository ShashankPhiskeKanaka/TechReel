import type { Request, Response } from "express";
import type { BadgeService } from "../service/badge.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";

const controllerMessages = new ControllerMessages("Badge");

class BadgeController extends BaseController<BadgeService> {
    constructor(service: BadgeService) {
        super(service, "Badge");
    }

    // /**
    //  * Handles the creation of a new badge.
    //  * Logs the request metadata and returns a success response with the created badge data.
    //  * @param {Request} req - Express request object containing badge data in the body.
    //  * @param {Response} res - Express response object.
    //  * @returns {Promise<Response>} API success response with the new badge.
    //  */
    // create = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.CREATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA"
    //     });

    //     const badge = await this.BadgeService.create(req.body);

    //     return ApiResponse.success(res, controllerMessages.CREATE.res, badge);
    // }

    // /**
    //  * Retrieves a single badge by its unique ID.
    //  * Extracts the ID from request parameters and validates existence via the service.
    //  * @param {Request} req - Express request object with 'id' parameter.
    //  * @param {Response} res - Express response object.
    //  * @returns {Promise<Response>} API success response with the badge data.
    //  */
    // fetch = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.FETCH.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA"
    //     });

    //     const badge = await this.BadgeService.fetch(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.FETCH.res, badge);
    // }

    /**
     * Retrieves a paginated and filtered list of all badges.
     * Parses query parameters for pagination (limit, sort, search) and cursor-based navigation.
     * @param {Request} req - Express request object with query filters.
     * @param {Response} res - Express response object.
     * @returns {Promise<Response>} API success response with a list of badges.
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const badges = await this.service.fetchAll(
            this.getPagination(req),
            {
                skillId: req.query.skillId?.toString(),
                xpReward: req.query.skillId?.toString()
            },
            [
                "name"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, badges)
    }

    // /**
    //  * Updates an existing badge identified by the ID in the request parameters.
    //  * @param {Request} req - Express request object containing updated fields in body and 'id' in params.
    //  * @param {Response} res - Express response object.
    //  * @returns {Promise<Response>} API success response with the updated badge.
    //  */
    // update = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.UPDATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA"
    //     });

    //     const badge = await this.BadgeService.update(req.body, req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.UPDATE.res, badge);
    // }


    // /**
    //  * Deletes a badge using either a soft or hard delete strategy.
    //  * The strategy is determined by the 'flag' boolean in the request body.
    //  * @param {Request} req - Express request object with 'id' in params and 'flag' in body.
    //  * @param {Response} res - Express response object.
    //  * @returns {Promise<Response>} API success response confirming deletion.
    //  */
    // delete = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.DELETE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA"
    //     });

    //     const badge = await this.BadgeService.delete(req.params.id?.toString() ?? "", req.body.flag);

    //     return ApiResponse.success(res, controllerMessages.DELETE.res, badge);
    // }
}

export { BadgeController }