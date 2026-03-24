import { prisma } from "../db/prisma.js";
import type { Report, ReportData } from "../dto/report.dto.js";

class ReelReportRepository {
    create = async (data: ReportData) : Promise<Report> => {
        const report = await prisma.reel_reports.create({
            data: data
        });

        return report;
    }

    fetch = async (id: string): Promise<Report> => {
        const report = await prisma.reel_reports.findUnique({
            where: {
                id: id
            }
        });

        return report ?? <Report>{};
    }

    fetchByReel = async (reelId: string): Promise<Report[]> => {
        const reports = await prisma.reel_reports.findMany({
            where: {
                reelId
            }
        });

        return reports;
    }

    fetchByUser = async (userId: string): Promise<Report[]> => {
        const reports = await prisma.reel_reports.findMany({
            where: {
                userId
            }
        });

        return reports;
    }

    delete = async (id: string): Promise<Report> => {
        const report = await prisma.reel_reports.delete({
            where: {
                id: id
            }
        });

        return report;
    }
}

export { ReelReportRepository }