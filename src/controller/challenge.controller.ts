import type { Request, Response } from "express";
import type { ChallengeService } from "../service/challenge.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";

const controllerMessages = new ControllerMessages("Challenge");

class ChallengeController extends BaseController<ChallengeService> {
    constructor(service: ChallengeService) {
        super(service, "Challenge");
    }

    // /**
    //  * Handles the HTTP request to create a new challenge.
    //  * 
    //  * @param {Request} req - Express request; expects challenge metadata and options in the body.
    //  * @param {Response} res - Express response; returns the created challenge record.
    //  * @returns {Promise<Response>} A standardized API response with the created challenge object.
    //  */
    // create = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.CREATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id
    //     });

    //     const challenge = await this.ChallengeService.create(req.body);

    //     return ApiResponse.success(res, controllerMessages.CREATE.res, challenge);
    // }

    // /**
    //  * Handles the HTTP request to fetch a specific challenge by its unique ID.
    //  * 
    //  * @param {Request} req - Express request; expects 'id' (challengeId) in path params.
    //  * @param {Response} res - Express response; returns the challenge with its options.
    //  * @returns {Promise<Response>} A standardized API response containing the challenge object.
    //  */
    // fetch = async (req: Request, res: Response) => {

    //     logger.http(controllerMessages.FETCH.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "PUBLIC",
    //         challengeId: req.params.id?.toString()
    //     });

    //     const challenge = await this.ChallengeService.fetch(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.FETCH.res, challenge);
    // }

    /**
     * Handles the HTTP request to retrieve a paginated list of challenges.
     * Supports filtering by skill, language, difficulty, and type, with 
     * case-insensitive search on the "question" field.
     * @param {Request} req - Express request; expects pagination and filter keys in query params.
     * @param {Response} res - Express response object.
     * @returns {Promise<Response>} API success response with a list of challenge objects.
     */
    fetchAll = async (req: Request, res: Response) => {

        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "PUBLIC",
            challengeId: req.params.id?.toString()
        });

        const challenges = await this.service.fetchAll(
            this.getPagination(req),
            {
                reelId: req.query.reelId?.toString(),
                language: req.query.language?.toString(),
                difficultyLevel: req.query.difficultyLevel?.toString(),
                challengeType: req.query.challengeType?.toString()
            },
            [
                "question"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, challenges);
    }

    // /**
    //  * Handles the HTTP request to update an existing challenge's metadata.
    //  * 
    //  * @param {Request} req - Express request; expects challengeId in path params and update data in body.
    //  * @param {Response} res - Express response; returns the updated challenge record.
    //  * @returns {Promise<Response>} A standardized API response with the updated object.
    //  */
    // update = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.UPDATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         challengeId: req.params.id?.toString()
    //     });

    //     const challenge = await this.ChallengeService.update(req.body, req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.UPDATE.res, challenge);
    // }

    // /**
    //  * Handles the HTTP request to delete a challenge.
    //  * 
    //  * @param {Request} req - Express request; expects 'id' in path params and 'flag' (boolean) in body.
    //  * @param {Response} res - Express response; returns the deleted challenge metadata.
    //  * @returns {Promise<Response>} A standardized API response confirming the deletion.
    //  * @note The 'flag' in the body determines if the deletion is a permanent hard delete (true) or soft delete (false).
    //  */
    // delete = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.DELETE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         challengeId: req.params.id?.toString()
    //     });

    //     const challenge = await this.ChallengeService.delete(req.params.id?.toString() ?? "", req.body.flag);

    //     return ApiResponse.success(res, controllerMessages.DELETE.res, challenge);
    // }
}

export { ChallengeController }