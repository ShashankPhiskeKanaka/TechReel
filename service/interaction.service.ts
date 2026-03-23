import { errorMessage } from "../constants/error.messages.js";
import type { LikesRepository } from "../repository/likes.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class InteractionService {
    constructor (private LikeMethods: LikesRepository) {}
    /**
     * Creates a new like record for a specific reel.
     * 
     * @param {string} userId - The unique identifier of the user liking the reel.
     * @param {string} reelId - The unique identifier of the reel being liked.
     * @returns {Promise<Object>} The created like record from the database.
     * @throws {Error} If the database operation fails (e.g., duplicate like if unique constraint exists).
     */
    likeReel = async (userId: string, reelId: string) => {
        const like = await this.LikeMethods.create({ user_id: userId, reel_id: reelId });

        logger.info("Reel like record created", {
            reelId,
            userId
        });

        return like;
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
        const like = await this.LikeMethods.delete(userId, reelId);

        logger.info("Reel like record deleted", {
            reelId,
            userId
        });

        return like;
    }

    /**
     * Confirms and retrieves a specific user's like record for a reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @param {string} userId - The unique identifier of the user.
     * @returns {Promise<Like>} The verified like record.
     * @throws {ServerError} 404 (Not Found) if the user has not liked this reel.
     */
    fetchLikeRecord = async (reelId: string, userId: string) => {
        const like = await this.LikeMethods.fetch(reelId, userId);

        if(!like.id) {
            logger.warn("No like record found", {
                reelId,
                userId
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Reel like record fetched", {
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

        if(likes.length == 0) {
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

}

export { InteractionService }