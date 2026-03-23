import type { TransactionType } from "../generated/prisma/enums.js"

interface Token {
    id: string,
    name: string,
    token_url: string | null,
    created_at: Date,
    deleted_at: Date | null
}

interface TokenData {
    name: string,
    token_url?: string,
}

interface TokenLedger {
    id: string
    user_id: string
    token_id: string
    amount: number
    source: string
    type: TransactionType
    created_at: Date
}

interface TokenLedgerData {
    user_id: string
    token_id: string
    amount: number
    source: string
    type: TransactionType
}

interface UserToken {
    id: string
    user_id: string
    token_id: string
    amount: number
    created_at: Date
}

interface UserTokenData {
    user_id: string
    token_id: string
    amount: number
}

export type { Token, TokenData, TokenLedger, TokenLedgerData, UserToken, UserTokenData }