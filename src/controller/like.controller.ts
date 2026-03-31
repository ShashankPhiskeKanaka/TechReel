import type { Request, Response } from "express";
import type { LikeService } from "../service/like.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";

const controllerMessages = new ControllerMessages("Like");

class LikeController extends BaseController<LikeService> {
    constructor(service: LikeService) {
        super(service, "Like");
    }

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

        await this.service.likeReel(req.user?.id ?? "", req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel liked");
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

        await this.service.unlikeReel(req.user?.id ?? "", req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel unliked");
    }

    // /**
    //  * Retrieves a specific like record to check if a user has liked a reel.
    //  * 
    //  * @param {Request} req - Express request; expects 'id' (reelId) in path params.
    //  * @param {Response} res - Express response; returns the like object or null if not found.
    //  * @returns {Promise<Response>} A standardized API response containing the like status.
    //  */
    // fetchLikeRecord = async (req: Request, res: Response) => {
    //     logger.http("Fetch like record request received", {
    //         likeRecordId: req.params.id,
    //         userId: req.user?.id,
    //         ip: req.ip
    //     });

    //     const like = await this.LikeService.fetchLikeRecord(req.user?.id ?? "", req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, "Like record fetched", like);
    // }

    /**
     * Handles the HTTP request to retrieve a paginated list of reel likes.
     * Supports filtering by a specific reel or a specific user to check engagement.
     * @param {Request} req - Express request; expects pagination and optional reelId/userId in query.
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
                reelId: req.query.reelId?.toString(),
                userId: req.query.userId?.toString()
            },
            []
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, likes);
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

        const likes = await this.service.fetchLikeCount(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel likes count fetched", likes);
    }
}

export { LikeController };