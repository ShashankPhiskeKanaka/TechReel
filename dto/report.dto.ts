import { reportStatus } from "../generated/prisma/enums.js"

interface ReportData{ 
    user_id: string
    reel_id: string
    reason: string
    status: reportStatus 
}

interface Report {
    id: string
    user_id: string
    reel_id: string
    reason: string
    status: reportStatus 
    created_at: Date   
}

export type { Report, ReportData }