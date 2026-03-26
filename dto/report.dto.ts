import { ReportReason, ReportStatus } from "../generated/prisma/enums.js"

interface ReportData{ 
    userId: string
    reelId: string
    reason: ReportReason
    status: ReportStatus 
}

interface Report {
    id: string
    userId: string
    reelId: string
    reason: ReportReason
    status: ReportStatus 
    createdAt: Date   
}

export type { Report, ReportData }