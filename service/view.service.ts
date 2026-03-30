import { errorMessage } from "../constants/error.messages.js";
import { ServiceMessages } from "../constants/service.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { ViewData, View } from "../dto/view.dto.js";
import { addInteractionTask } from "../jobs/producers/interaction.producer.js";
import type { ViewRepository } from "../repository/view.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";

const serviceMessages = new ServiceMessages("View");

class ViewService extends BaseService<View, ViewData, any> {
    constructor (methods: ViewRepository) {
        super(methods, "View");
    }

    /**
     * Records a new view event and updates the reel's global view counter.
     * 
     * @param {ViewData} data - Object containing reelId, userId, duration, and completion status.
     * @returns {Promise<Views>} The newly created view transaction record.
     * @note This handles both the detailed history log and the denormalized counter increment.
     */
    createView = async (data: ViewData) => {

        await addInteractionTask({ ...data, process: "INCREMENT" }, "VIEW");

        logger.info("New view record create job added to the queue", {
            reelId: data.reelId,
            userId: data.userId,
            type: "VIEw",
            process: "INCREMENT"
        });

        return;
    }

    // fetchAll= async (data: PaginationData, filters: {}, searchFields: string[]) => {
    //     const viewRecords = await this.ViewMethods.fetchAll(data, filters, searchFields);

    //     if(viewRecords.length == 0) {
    //         logger.warn(serviceMessages.FETCHALL.error);

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info(serviceMessages.FETCHALL.message);

    //     return viewRecords;
    // }

    /**
     * Retrieves the total view count for a specific reel.
     * 
     * @param {string} reelId - The unique identifier of the reel.
     * @returns {Promise<number>} The total number of views recorded for the reel.
     * @note This utilizes the denormalized counter for high-performance retrieval.
     */
    fetchViews = async (reelId: string) => {
        const views = await this.methods.fetchViews(reelId);

        logger.info("Total views for a reel fetched", {
            reelId
        });

        return views;
    }

    // /**
    //  * Retrieves a single view record and validates its existence.
    //  * 
    //  * @param {string} id - The unique identifier (UUID) of the view record.
    //  * @returns {Promise<Views>} The validated view record object.
    //  * @throws {ServerError} 404 (Not Found) if the record does not exist or is malformed.
    //  */
    // fetch = async (id: string) => {
    //     const view = await this.methods.fetch(id);

    //     if (!view.id) {
    //         logger.warn(serviceMessages.FETCH.error, {
    //             viewId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info(serviceMessages.FETCH.message, {
    //         viewId: id
    //     });

    //     return view;
    // }

    /**
     * Offloads the update of a video view record (rewatch) to a background worker.
     * @param data - Metadata for the view (userId, reelId, watchedSeconds, etc).
     * @returns Promise<void> - Returns immediately after the task is queued.
     * @throws {Error} If the task cannot be added to the Redis queue.
     */
    updateView = async (data: ViewData) => {
        await addInteractionTask({ ...data, process: "REWATCHED" }, "VIEW");

        logger.info("View record update job added to the queue", {
            userId: data.userId,
            reelId: data.reelId,
            type: "VIEW",
            process: "REWATCHED"
        });

        return;
    }
}

export { ViewService }