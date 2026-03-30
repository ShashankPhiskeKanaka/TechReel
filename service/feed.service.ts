import type { Reel, ReelData } from "../dto/reel.dto.js";
import type { FeedRepository } from "../repository/feed.repository.js";
import type { ReelReportRepository } from "../repository/reelReport.repository.js";
import { BaseService } from "./base.service.js";

class FeedService {
    constructor(private methods: FeedRepository) {}

    fetch = async (id: string) => {
        const reels = await this.methods.fetch(id);

        return reels;
    }
}

export { FeedService };