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

        await this.InteractionService.likeReel(req.user?.id ?? "", req.params.id?.toString() ?? "");

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

        await this.InteractionService.unlikeReel(req.user?.id ?? "", req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel unliked");
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

        const like = await this.InteractionService.fetchLikeRecord( req.user?.id ?? "", req.params.id?.toString() ?? "");

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

    /**
     * Handles the HTTP request to record a new reel view.
     * 
     * @param {Request} req - Express request; expects view details in body and userId from session.
     * @param {Response} res - Express response; returns the created view record and success status.
     * @returns {Promise<Response>} A standardized API response containing the view metadata.
     */
    createViewRecord = async (req: Request, res: Response) => {
        logger.http("View record creation request received", {
            userId: req.user?.id ?? "",
            reelId: req.body.reelId,
            ip: req.ip
        });

        await this.InteractionService.createViewRecord({
            ...req.body,
            userId: req.user?.id ?? ""
        });

        return ApiResponse.success(res, "View record created");
    }

    /**
     * Handles the HTTP request to update a reel view record.
     * 
     * @param {Request} req - Express request; expects `reelId` in body and `userId` from session.
     * @param {Response} res - Express response; returns a 200 status once the job is queued.
     * @returns {Promise<Response>} A standardized API response confirming the request was received.
     */

    updateViewRecord = async (req: Request, res: Response) => {
        logger.http("View record update request received", {
            ip: req.ip,
            userId: req.user?.id,
            reelId: req.body.reelId
        });

        await this.InteractionService.updateViewRecord({...req.body, userId: req.user?.id ?? ""});

        return ApiResponse.success(res, "View record updated");
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

        const views = await this.InteractionService.fetchViews(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Views fetched for reel", views);
    }

    /**
     * Handles the HTTP request to retrieve a specific view record by its unique ID.
     * 
     * @param {Request} req - Express request; expects 'id' (viewRecordId) in path params.
     * @param {Response} res - Express response; returns the detailed view record metadata.
     * @returns {Promise<Response>} A standardized API response containing the view object.
     */
    fetchViewRecord = async (req: Request, res: Response) => {
        logger.http("Fetch view record request received", {
            ip: req.ip,
            viewId: req.params.id?.toString(),
            userId: req.user?.id
        });

        const view = await this.InteractionService.fetchViewRecord(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "View record fetched", view);
    }

    /**
     * Handles the HTTP request to retrieve all individual view records for a reel.
     * 
     * @param {Request} req - Express request; expects 'id' (reelId) in path params.
     * @param {Response} res - Express response; returns an array of detailed view records.
     * @returns {Promise<Response>} A standardized API response containing the views list.
     */
    fetchViewRecordsByReel = async (req: Request, res: Response) => {
        logger.http("Fetch view records by reel request received", {
            ip: req.ip,
            reelId: req.params.id?.toString()
        });

        const views = await this.InteractionService.fetchViewRecordsByReel(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "View records fetched", views);
    }

    /**
     * Handles the HTTP request to retrieve the authenticated user's viewing history.
     * 
     * @param {Request} req - Express request; extracts userId from the authenticated session.
     * @param {Response} res - Express response; returns an array of the user's view records.
     * @returns {Promise<Response>} A standardized API response containing the user's history.
     */
    fetchViewRecordsByUser = async (req: Request, res: Response) => {
        logger.http("Fetch view records by user request received", {
            ip: req.ip,
            userId: req.user?.id
        });

        const views = await this.InteractionService.fetchViewRecordsByUser(req.user?.id ?? "");

        return ApiResponse.success(res, "View records fetched", views);
    }

    /**
     * Handles the HTTP request to delete a specific view record.
     * 
     * @param {Request} req - Express request; expects 'id' (viewRecordId) in path params.
     * @param {Response} res - Express response; returns the metadata of the deleted record.
     * @returns {Promise<Response>} A standardized API response confirming the deletion.
     */
    deleteView = async (req: Request, res: Response) => {
        logger.http("View record delete request received", {
            ip: req.ip,
            userId: req.user?.id,
            viewId: req.params.id?.toString()
        });

        const view = await this.InteractionService.deleteView(req.body.viewId, req.body.reelId);

        return ApiResponse.success(res, "View record deleted", view);
    }
}

export { InteractionController };