import type { TransactionType } from "../../generated/prisma/enums.js"

interface Token {
    id: string,
    name: string,
    tokenUrl: string | null,
    createdAt: Date,
    deletedAt: Date | null
}

interface TokenData {
    name: string,
    tokenUrl?: string,
    imageType: string
}

interface TokenLedger {
    id: string
    userId: string
    tokenId: string | null
    amount: number
    source: string
    type: TransactionType
    createdAt: Date
}

interface TokenLedgerData {
    userId: string
    amount: number
    source: string
    type: TransactionType
    tokenId: string
}

interface UserToken {
    id: string
    userId: string
    tokenId: string
    amount: number
    createdAt: Date
}

interface UserTokenData {
    userId: string
    tokenId: string
    amount: number
}

export type { Token, TokenData, TokenLedger, TokenLedgerData, UserToken, UserTokenData }