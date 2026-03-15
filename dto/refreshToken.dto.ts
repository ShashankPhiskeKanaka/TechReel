interface RefreshToken {
    id : string
    family_id: string
    user_id : string
    is_valid : boolean
    created_at : Date
}

export type { RefreshToken }