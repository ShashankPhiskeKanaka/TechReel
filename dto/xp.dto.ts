import type { TransactionType } from "../generated/prisma/enums.js"

interface XpData {
    userId: string
    amount: number
    source: string
    type: TransactionType
}

interface Xp {
    id: string
    userId: string
    amount: number
    source: string
    type: TransactionType
    createdAt: Date
    deletedAt: Date | null
}

export type { Xp, XpData }