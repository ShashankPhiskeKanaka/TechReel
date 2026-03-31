import type { Role } from "./user.dto.js"

interface RefreshToken {
    id : string
    familyId: string
    userId : string
    isUsed : boolean
    createdAt : Date
    role: Role
}

interface user {
    id: string
    role: Role
}

export type { RefreshToken, user }