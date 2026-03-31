import { cursorTo } from "node:readline";
import { prisma } from "../../db/prisma.js"
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { ReelData, Reel, ReelUpdateData, Difficulty } from "../dto/reel.dto.js";
import { status } from "../../generated/prisma/enums.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class ReelRespository extends BaseRepository<Reel, ReelData, any> {
    constructor() {
        super(prisma.reels, "Reel");
    }

    // /**
    //  * Creates a new reel record with a default pending status.
    //  * 
    //  * @param {ReelData} data - The initial metadata for the reel.
    //  * @returns {Promise<Reel>} The newly created reel record.
    //  */
    // create = async (data: ReelData) : Promise<Reel> => {
    //     const reel = await prisma.reels.create({
    //         data
    //     });

    //     return reel;
    // }

    /**
     * Updates the processing status and media assets of a reel.
     * 
     * @description Typically called by background workers after video transcoding is complete.
     * @param {status} status - The new operational status (e.g., UPLOADED).
     * @param {string} id - Unique identifier of the reel.
     * @param {any} data - Metadata containing asset URLs and video duration.
     * @returns {Promise<Reel>} The updated reel record.
     */
    updateStatus = async (status: status, id: string, data: any): Promise<Reel> => {
        const reel = await prisma.reels.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                status: status,
                videoUrl: data.url,
                thumbnailUrl: data.thumbnailUrl,
                duration: data.duration
            }
        });

        return reel;
    }

    // /**
    //  * Updates general reel metadata with optional ownership verification.
    //  * 
    //  * @param {any} data - The partial data to update.
    //  * @param {string} id - Unique identifier of the reel.
    //  * @param {string} [creatorId] - Optional ID to ensure only the owner can modify.
    //  * @returns {Promise<Reel>} The modified reel record.
    //  */
    // update = async (data: any, id: string, creatorId?: string): Promise<Reel> => {
    //     const reel = await prisma.reels.update({
    //         where: {
    //             id,
    //             deletedAt: null,
    //             ...(creatorId ? {creatorId} : {})
    //         },
    //         data
    //     });

    //     return reel;
    // }

    // /**
    //  * Retrieves a single active and fully processed reel.
    //  * 
    //  * @description Filters for non-deleted and successfully uploaded content only.
    //  * @param {string} id - Unique identifier of the reel.
    //  * @returns {Promise<Reel>} The found reel or an empty object if unavailable.
    //  */
    // fetch = async (id: string) : Promise<Reel> => {
    //     const reel = await prisma.reels.findUnique({
    //         where: {
    //             id,
    //             deletedAt: null,
    //             status: "UPLOADED"
    //         }
    //     });

    //     return reel ?? <Reel>{};
    // }

    // /**
    //  * Retrieves a paginated feed of successfully uploaded reels.
    //  * 
    //  * @description Implements keyset pagination using a composite cursor (id + createdAt) 
    //  * to maintain high-performance streaming. Filters strictly for "UPLOADED" status 
    //  * to ensure only processed content is visible. Dynamic filtering.
    //  * 
    //  * @param {PaginationData} data - Pagination metadata, sorting direction, and search criteria.
    //  * @returns {Promise<Reel[]>} A list of active, uploaded reel records.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<Reel[]> => {

    //     let where: any = {
    //         deletedAt: null,
    //         status: "UPLOADED"
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const reels = await prisma.reels.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             {createdAt: ( data.sort ?? PaginationConstants.sort ) as 'asc' | 'desc'},
    //             { id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return reels;
    // }

    // /**
    //  * Executes a soft delete by marking the record with a timestamp.
    //  * 
    //  * @description Updates the deletedAt field to the current date, effectively hiding 
    //  * the record from standard queries while preserving data for audit trails or recovery. 
    //  * Includes optional ownership validation via creatorId.
    //  * 
    //  * @param {string} id - The unique identifier of the reel.
    //  * @param {string} [creatorId] - Optional ID to ensure only the owner can delete.
    //  * @returns {Promise<Reel>} The updated reel record.
    //  */
    // softDelete = async (id: string, creatorId?: string) : Promise<Reel> => {
    //     const reel = await prisma.reels.update({
    //         where: {
    //             id,
    //             deletedAt: null,
    //             ...(creatorId ? { creatorId } : {})
    //         },
    //         data: {
    //             deletedAt: new Date()
    //         }
    //     });

    //     return reel;
    // }

    // /**
    //  * Permanently removes a reel record from the database.
    //  * 
    //  * @description Performs a hard delete, irrecoverably removing the row. 
    //  * Includes optional ownership validation to prevent unauthorized deletions.
    //  * 
    //  * @param {string} id - The unique identifier of the reel.
    //  * @param {string} [creatorId] - Optional ID to verify record ownership.
    //  * @returns {Promise<Reel>} The deleted reel record.
    //  */
    // hardDelete = async (id: string, creatorId?: string) : Promise<Reel> => {
    //     const reel = await prisma.reels.delete({
    //         where: {
    //             id,
    //             ...(creatorId ? { creatorId } : {})
    //         }
    //     });

    //     return reel;
    // }
}

export { ReelRespository }