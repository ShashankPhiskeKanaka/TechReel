import type { Role } from "./user.dto.js"

interface RefreshToken {
    id : string
    family_id: string
    user_id : string
    is_used : boolean
    created_at : Date
    role: Role
}

interface user {
    id: string
    role: Role
}

export type { RefreshToken, user }