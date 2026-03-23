import type { TransactionType } from "../generated/prisma/enums.js"

interface XpData {
    user_id: string
    amount: number
    source: string
    type: TransactionType
}

interface Xp {
    id: string
    user_id: string
    amount: number
    source: string
    type: TransactionType
    created_at: Date
    deleted_at: Date | null
}

export type { Xp, XpData }