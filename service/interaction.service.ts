import { errorMessage } from "../constants/error.messages.js";
import type { ViewData } from "../dto/view.dto.js";
import { interactionQueue } from "../jobs/queues/interaction.queue.js";
import { addInteractionTask } from "../jobs/producers/interaction.producer.js";
import type { LikeRepository } from "../repository/like.repository.js";
import type { ViewRepository } from "../repository/view.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class InteractionService {
    constructor(private LikeMethods: LikeRepository, private ViewMethods: ViewRepository) { }
    /**
     * Creates a new like record for a specific reel.
     * 
     * @param {string} userId - The unique identifier of the user liking the reel.
     * @param {string} reelId - The unique identifier of the reel being liked.
     * @returns {Promise<Object>} The created like record from the database.
     * @throws {Error} If the database operation fails (e.g., duplicate like if unique constraint exists).
     */
    likeReel = async (userId: string, reelId: string) => {

        await addInteractionTask({ reelId, userId, process: "INCREMENT" }, "LIKE");

        logger.info("Reel like record create job added to the queue", {
            reelId,
            userId,
            type: "LIKE",
            process: "INCREMENT"
        });

        return;

    }

    /**
     * Removes a like record for a specific reel and user.
     * 
     * @param {string} userId - The unique identifier of the user unliking the reel.
     * @param {string} reelId - The unique identifier of the reel being unliked.
     * @returns {Promise<Object | BatchPayload>} The result of the deletion (deleted record or count).
     * @throws {Error} If the record does not exist or the database operation fails.
     */
    unlikeReel = async (userId: string, reelId: string) => {

        await addInteractionTask({ reelId, userId, process: "DECREMENT" }, "LIKE");

        logger.info("Reel like record delete job added to the queue", {
            reelId,
            userId,
            type: "LIKE",
            process: "DECREMENT"
        });

        return;
    }

    /**
     * Confirms and retrieves a specific user's like record for a reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @param {string} userId - The unique identifier of the user.
     * @returns {Promise<Like>} The verified like record.
     * @throws {ServerError} 404 (Not Found) if the user has not liked this reel.
     */
    fetchLikeRecord = async (userId: string, reelId: string) => {
        const like = await this.LikeMethods.fetch(reelId, userId);

        if (!like.id) {
            logger.warn("No like record found", {
                reelId,
                userId
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Reel like record fetched", {
            likeId: like.id,
            reelId,
            userId
        });

        return like;
    }

    /**
     * Retrieves all detailed like records for a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<reel_likes[]>} A list of all user-reel like relationships.
     * @throws {ServerError} 404 (Not Found) if the reel has no likes.
     * @note This is typically used for administrative views or detailed "liked by" lists.
     */
    fetchLikeRecords = async (reelId: string) => {
        const likes = await this.LikeMethods.fetchLikesRecords(reelId);

        if (likes.length == 0) {
            logger.warn("No like records found", {
                reelId
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Reel like records fetched", {
            reelId
        });

        return likes;
    }

    /**
     * Retrieves the total count of likes for a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<number | Object>} The total count of likes (usually a number or a count object).
     * @throws {Error} If the database query for the reel's likes fails.
     */
    fetchLikes = async (reelId: string) => {
        const likes = await this.LikeMethods.fetchLikesCount(reelId);

        logger.info("Reel likes count fetched", {
            reelId
        });

        return likes;
    }

    /**
     * Records a new view event and updates the reel's global view counter.
     * 
     * @param {ViewData} data - Object containing reelId, userId, duration, and completion status.
     * @returns {Promise<Views>} The newly created view transaction record.
     * @note This handles both the detailed history log and the denormalized counter increment.
     */
    createViewRecord = async (data: ViewData) => {

        await addInteractionTask({ ...data, process: "INCREMENT" }, "VIEW");

        logger.info("New view record create job added to the queue", {
            reelId: data.reelId,
            userId: data.userId,
            type: "VIEw",
            process: "INCREMENT"
        });

        return;
    }

    /**
     * Retrieves all detailed viewing records for a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<Views[]>} A collection of view records including user IDs and watch durations.
     * @note Typically used for creator analytics or administrative review of video performance.
     */
    fetchViewRecordsByReel = async (reelId: string) => {
        const views = await this.ViewMethods.fetchViewRecordsByReel(reelId);

        logger.info("View records by reelId fetched", {
            reelId
        });

        return views;
    }

    /**
     * Retrieves the full viewing history for a specific user.
     * 
     * @param {string} userId - The unique identifier of the user.
     * @returns {Promise<Views[]>} A list of all view records associated with the user.
     * @note Typically used to populate the "Watch History" or "Library" section of the app.
     */
    fetchViewRecordsByUser = async (userId: string) => {
        const views = await this.ViewMethods.fetchViewRecordsByUser(userId);

        logger.info("View records by userId fetched", {
            userId
        });

        return views;
    }

    /**
     * Retrieves the total view count for a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<number>} The total number of views recorded for the reel.
     * @note This utilizes the denormalized counter for high-performance retrieval.
     */
    fetchViews = async (reelId: string) => {
        const views = await this.ViewMethods.fetchTotalViews(reelId);

        logger.info("Total views for a reel fetched", {
            reelId
        });

        return views;
    }

    /**
     * Retrieves a single view record and validates its existence.
     * 
     * @param {string} id - The unique identifier (UUID) of the view record.
     * @returns {Promise<Views>} The validated view record object.
     * @throws {ServerError} 404 (Not Found) if the record does not exist or is malformed.
     */
    fetchViewRecord = async (id: string) => {
        const view = await this.ViewMethods.fetchViewRecord(id);

        if (!view.id) {
            logger.warn("No view record found", {
                viewId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("View record fetched", {
            viewId: id
        });

        return view;
    }

    updateViewRecord = async (data: ViewData) => {
        await addInteractionTask({ ...data, process: "REWATCHED" }, "VIEW");

        logger.info("View record update job added to the queue", {
            userId: data.userId,
            reelId: data.reelId,
            type: "VIEW",
            process: "REWATCHED"
        });

        return;
    }

    /**
     * Removes a specific view record from the database.
     * 
     * @param {string} id - The unique identifier of the view record to be deleted.
     * @returns {Promise<Views>} The deleted view record details.
     * @throws {Error} If the deletion fails or the record does not exist.
     */
    deleteView = async (id: string, reelId: string) => {
        const view = await this.ViewMethods.deleteView(id, reelId);

        logger.info("View record deleted", {
            viewId: id,
            reelId
        });

        return view;
    }

}

export { InteractionService }