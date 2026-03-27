import type { Request, Response } from "express";
import type { ChallengeOptionService } from "../service/challengeOption.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";

const controllerMessages = new ControllerMessages("Challenge Option");

class ChallengeOptionController extends BaseController<ChallengeOptionService> {
    constructor(service: ChallengeOptionService) {
        super(service, "Challenge option")
    }

    // /**
    //  * Handles the HTTP PATCH request to modify a specific challenge option.
    //  * 
    //  * @param {Request} req - Express request; expects 'id' in path params and partial update data in body.
    //  * @param {Response} res - Express response; returns the updated option record.
    //  * @returns {Promise<Response>} A standardized API response containing the modified option.
    //  */
    // update = async (req: Request, res: Response) => {
    //     logger.http(controllerMessage.CREATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         challengeOptionId: req.params.id?.toString()
    //     });

    //     const challengeOption = await this.ChallengeOptionService.update(req.body, req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessage.CREATE.res, challengeOption);
    // }

    // /**
    //  * Handles the HTTP GET request to retrieve a single challenge option by its ID.
    //  * 
    //  * @param {Request} req - Express request; expects 'id' (optionId) in path params.
    //  * @param {Response} res - Express response; returns the specific option metadata.
    //  * @returns {Promise<Response>} A standardized API response containing the option object.
    //  */
    // fetch = async (req: Request, res: Response) => {
    //     logger.http(controllerMessage.FETCH.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         challengeOptionId: req.params.id?.toString()
    //     });

    //     const challengeOption = await this.ChallengeOptionService.fetch(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessage.FETCH.res, challengeOption);
    // }

    /**
     * Handles the HTTP request to retrieve a paginated and filtered list of challenges.
     * Maps query parameters to the service layer for filtering by challenge ID and correctness.
     * @param {Request} req - Express request; expects pagination and filters in query params.
     * @param {Response} res - Express response object.
     * @returns {Promise<Response>} API success response with a list of challenges.
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
                challengeId: req.query.challengeId?.toString(),
                isCorrect: req.query.isCorrect?.toString()
            },
            []
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, challenges);
    }

    /**
     * Handles the HTTP request to retrieve all options for a specific challenge.
     * Extracts the challenge identifier from the path parameters.
     * @param {Request} req - Express request; expects challenge 'id' in path parameters.
     * @param {Response} res - Express response object.
     * @returns {Promise<Response>} API success response with challenge options.
     */
    fetchAllOptions = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id,
            challengeOptionId: req.params.id?.toString()
        });    

        const challengeOptions = await this.service.fetchAllOptions(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, challengeOptions);
    }
}

export { ChallengeOptionController }