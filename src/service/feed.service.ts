import type { Reel, ReelData } from "../dto/reel.dto.js";
import type { FeedRepository } from "../repository/feed.repository.js";
import type { ReelReportRepository } from "../repository/reelReport.repository.js";
import { BaseService } from "./base.service.js";

class FeedService {
    constructor(private methods: FeedRepository) { }

    /**
     * Retrieves a single reel record or a collection of reels associated with the ID.
     * @param id - The unique identifier for the reel or the user owning the reels.
     * @returns A promise resolving to the reel data found in the database.
     * @throws {Error} If the database query fails.
     */
    fetch = async (id: string) => {
        const reels = await this.methods.fetch(id);

        return reels;
    }
}

export { FeedService };