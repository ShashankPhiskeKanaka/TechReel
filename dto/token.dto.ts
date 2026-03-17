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

export type { Token, TokenData }