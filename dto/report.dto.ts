import { reportStatus } from "../generated/prisma/enums.js"

interface ReportData{ 
    userId: string
    reelId: string
    reason: string
    status: reportStatus 
}

interface Report {
    id: string
    userId: string
    reelId: string
    reason: string
    status: reportStatus 
    createdAt: Date   
}

export type { Report, ReportData }