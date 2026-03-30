import type { Request, Response } from "express";
import type { FeedService } from "../service/feed.service.js";
import { ApiResponse } from "../utils/api.utils.js";

class FeedController {
    constructor(private service: FeedService) {}

    fetch = async (req: Request, res: Response) => {
        const reels = await this.service.fetch(req.user?.id ?? "");

        return ApiResponse.success(res, "Feed fetched", reels);
    }
}

export { FeedController };