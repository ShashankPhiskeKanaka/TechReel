import type { Request, Response } from "express";
import type { ChallengeService } from "../service/challenge.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

class ChallengeController {
    constructor ( private ChallengeService: ChallengeService ) {}

    /**
     * Handles the HTTP request to create a new challenge.
     * 
     * @param {Request} req - Express request; expects challenge metadata and options in the body.
     * @param {Response} res - Express response; returns the created challenge record.
     * @returns {Promise<Response>} A standardized API response with the created challenge object.
     */
    create = async (req: Request, res: Response) => {
        logger.http("Challenge creation request received", {
            ip: req.ip,
            userId: req.user?.id
        });

        const challenge = await this.ChallengeService.create(req.body);

        return ApiResponse.success(res, "Challenge created", challenge);
    }

    /**
     * Handles the HTTP request to fetch a specific challenge by its unique ID.
     * 
     * @param {Request} req - Express request; expects 'id' (challengeId) in path params.
     * @param {Response} res - Express response; returns the challenge with its options.
     * @returns {Promise<Response>} A standardized API response containing the challenge object.
     */
    fetch = async (req: Request, res: Response) => {

        logger.http("Fetch challenge request recieved", {
            ip: req.ip,
            userId: req.user?.id ?? "PUBLIC",
            challengeId: req.params.id?.toString()
        });

        const challenge = await this.ChallengeService.fetch(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge fetched", challenge);
    }

    /**
     * Handles the HTTP request to retrieve a challenge associated with a specific reel.
     * 
     * @param {Request} req - Express request; expects 'id' (reelId) in path params.
     * @param {Response} res - Express response; returns the associated challenge.
     * @returns {Promise<Response>} A standardized API response containing the challenge object.
     */
    fetchByReel = async (req: Request, res: Response) => {
        logger.http("Fetch challenge by reel request received", {
            ip: req.ip,
            userId: req.user?.id,
            reelId: req.params.id?.toString()
        });

        const challenge = await this.ChallengeService.fetchByReel(req.params.id?.toString() ?? "");
        return ApiResponse.success(res, "Challenge fetched by reelId", challenge);
    }

    /**
     * Handles the HTTP request to update an existing challenge's metadata.
     * 
     * @param {Request} req - Express request; expects challengeId in path params and update data in body.
     * @param {Response} res - Express response; returns the updated challenge record.
     * @returns {Promise<Response>} A standardized API response with the updated object.
     */
    update = async (req: Request, res: Response) => {
        logger.http("Challenge update request received", {
            ip: req.ip,
            userId: req.user?.id,
            challengeId: req.params.id?.toString()
        });

        const challenge = await this.ChallengeService.update(req.body, req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge updated", challenge);
    }

    /**
     * Handles the HTTP request to delete a challenge.
     * 
     * @param {Request} req - Express request; expects 'id' in path params and 'flag' (boolean) in body.
     * @param {Response} res - Express response; returns the deleted challenge metadata.
     * @returns {Promise<Response>} A standardized API response confirming the deletion.
     * @note The 'flag' in the body determines if the deletion is a permanent hard delete (true) or soft delete (false).
     */
    delete = async (req: Request, res: Response) => {
        logger.http("Challenge delete request received", {
            ip: req.ip,
            userId: req.user?.id,
            challengeId: req.params.id?.toString()
        });

        const challenge = await this.ChallengeService.delete(req.body.flag, req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge deleted", challenge);
    }
}

export { ChallengeController }