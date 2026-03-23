import type { Request, Response } from "express";
import type { InteractionService } from "../service/interaction.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

class InteractionController {
    constructor(private InteractionService: InteractionService) {}

    /**
     * Handles the process of liking a reel
     * 
     * @param {Request} req - expects reelId in parameters and user 
     * @param {Response} res - returns success message and boolean value
     * @returns {Promise<Response>} A standardized API response
     */
    likeReel = async (req: Request, res: Response) => {
        logger.http("Like reel request received", {
            reelId: req.params.id,
            userId: req.user?.id,
            ip: req.ip
        });

        const like = await this.InteractionService.likeReel(req.user?.id ?? "", req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel liked", like);
    }

    /**
     * Handles removing a like from a reel (unliking).
     * 
     * @param {Request} req - Express request; expects 'id' (reelId) in path params.
     * @param {Response} res - Express response; returns success message and deletion metadata.
     * @returns {Promise<Response>} A standardized API response containing the deletion result.
     */
    unlikeReel = async (req: Request, res: Response) => {
        logger.http("Unlike reel request received", {
            reelId: req.params.id,
            userId: req.user?.id,
            ip: req.ip
        });

        const like = await this.InteractionService.unlikeReel(req.user?.id ?? "", req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel unliked", like);
    }

    /**
     * Retrieves a specific like record to check if a user has liked a reel.
     * 
     * @param {Request} req - Express request; expects 'id' (reelId) in path params.
     * @param {Response} res - Express response; returns the like object or null if not found.
     * @returns {Promise<Response>} A standardized API response containing the like status.
     */
    fetchLikeRecord = async (req: Request, res: Response) => {
        logger.http("Fetch like record request received", {
            likeRecordId: req.params.id,
            userId: req.user?.id,
            ip: req.ip
        });

        const like = await this.InteractionService.fetchLikeRecord(req.params.id?.toString() ?? "", req.user?.id ?? "");

        return ApiResponse.success(res, "Like record fetched", like);
    }

    /**
     * Retrieves the total number of likes for a specific reel.
     * 
     * @param {Request} req - Express request; expects 'id' (reelId) in path params.
     * @param {Response} res - Express response; returns the total count of likes.
     * @returns {Promise<Response>} A standardized API response containing the numeric count.
     */
    fetchLikeCount = async (req: Request, res: Response) => {
        logger.http("Fetch reel likes count request received", {
            reelId: req.params.id,
            ip: req.ip
        });

        const likes = await this.InteractionService.fetchLikes(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel likes count fetched", likes);
    }
}

export { InteractionController };