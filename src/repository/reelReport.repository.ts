import { prisma } from "../../db/prisma.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { Report, ReportData } from "../dto/report.dto.js";
import { ReportStatus, ReportReason } from "../../generated/prisma/enums.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class ReelReportRepository extends BaseRepository<Report, ReportData, any> {

    constructor() {
        super(prisma.reel_reports, "Reel report");
    }

    // /**
    //   * Creates a new report for a reel.
    //   * @param {ReportData} data - The report details, including the reason and target reel ID.
    //   * @returns {Promise<Report>} The newly created report record.
    //   */
    // create = async (data: ReportData) : Promise<Report> => {
    //     const report = await prisma.reel_reports.create({
    //         data: data
    //     });

    //     return report;
    // }

    // /**
    //  * Retrieves a specific report by its unique ID.
    //  * @param {string} id - The ID of the report to fetch.
    //  * @returns {Promise<Report>} The report object, or an empty object if not found.
    //  */
    // fetch = async (id: string, userId?: string): Promise<Report> => {
    //     const report = await prisma.reel_reports.findUnique({
    //         where: {
    //             id,
    //             ...(userId ? {userId} : {})
    //         }
    //     });

    //     return report ?? <Report>{};
    // }

    // /**
    //  * Retrieves a paginated list of pending reports based on filters.
    //  * @param {PaginationData} data - Pagination settings (limit, sort order).
    //  * @param {Object} filters - Filtering criteria to narrow down the reports.
    //  * @returns {Promise<Report[]>} A list of reports with a 'PENDING' status.
    //  */
    // fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<Report[]> => {
    //     let where: any = {
    //         status: ReportStatus.PENDING,
    //         AND: []
    //     }

    //     where = serverUtils.buildWhere(where, filters, data, searchFields);

    //     const reports = await prisma.reel_reports.findMany({
    //         take: data.limit ?? PaginationConstants.limit,
    //         where,
    //         orderBy: [
    //             {createdAt: (data.sort ?? PaginationConstants.sort)  as 'asc' | 'desc'},
    //             {id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
    //         ]
    //     });

    //     return reports;
    // }

    // /**
    //  * Permanently deletes a report from the database.
    //  * @param {string} id - The ID of the report to remove.
    //  * @returns {Promise<Report>} The deleted report record.
    //  */
    // hardDelete = async (id: string): Promise<Report> => {
    //     const report = await prisma.reel_reports.delete({
    //         where: {
    //             id: id
    //         }
    //     });

    //     return report;
    // }

    // /**
    //  * Performs a soft delete by updating the report status instead of removing the record.
    //  * @param {string} id - The unique identifier of the report.
    //  * @param {ReportStatus} status - The new status to assign (e.g., RESOLVED or REJECTED).
    //  * @returns {Promise<Report>} The updated report record.
    //  */
    // softDelete = async (id: string, status: ReportStatus): Promise<Report> => {
    //     const report = await prisma.reel_reports.update({
    //         where: {
    //             id
    //         },
    //         data: {
    //             status
    //         }
    //     });

    //     return report;
    // }
}

export { ReelReportRepository }