import type { Request, Response } from "express";
import type { FeedService } from "../service/feed.service.js";
import { ApiResponse } from "../utils/api.utils.js";

class FeedController {
    constructor(private service: FeedService) { }

    /**
     * Handles the retrieval of the personalized video feed for the authenticated user.
     * @param req - Express Request (user: id)
     * @param res - Express Response (json: recommended reels)
     * @returns A promise resolving to a success response with the feed data.
     */
    fetch = async (req: Request, res: Response) => {
        const reels = await this.service.fetch(req.user?.id ?? "");

        return ApiResponse.success(res, "Feed fetched", reels);
    }
}

export { FeedController };