import type { Request, Response } from "express";
import type { ChallengeOptionService } from "../service/challengeOption.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

class ChallengeOptionController {
    constructor(private ChallengeOptionService: ChallengeOptionService) {}

    /**
     * Handles the HTTP PATCH request to modify a specific challenge option.
     * 
     * @param {Request} req - Express request; expects 'id' in path params and partial update data in body.
     * @param {Response} res - Express response; returns the updated option record.
     * @returns {Promise<Response>} A standardized API response containing the modified option.
     */
    update = async (req: Request, res: Response) => {
        logger.http("Challenge option update request received", {
            ip: req.ip,
            userId: req.user?.id,
            challengeOptionId: req.params.id?.toString()
        });

        const challengeOption = await this.ChallengeOptionService.update(req.body, req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge option updated", challengeOption);
    }

    /**
     * Handles the HTTP GET request to retrieve a single challenge option by its ID.
     * 
     * @param {Request} req - Express request; expects 'id' (optionId) in path params.
     * @param {Response} res - Express response; returns the specific option metadata.
     * @returns {Promise<Response>} A standardized API response containing the option object.
     */
    find = async (req: Request, res: Response) => {
        logger.http("Challenge option fetch request received", {
            ip: req.ip,
            userId: req.user?.id,
            challengeOptionId: req.params.id?.toString()
        });

        const challengeOption = await this.ChallengeOptionService.fetch(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge option fetched", challengeOption);
    }
}

export { ChallengeOptionController }