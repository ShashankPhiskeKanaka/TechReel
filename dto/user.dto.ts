type Role = "ADMIN" | "USER" | "CREATOR"

interface User {
    id: string
    email: string
    username: string
    password: string
    auth_provider: string
    created_at: Date
    deleted_at: Date | undefined
    role: Role
    verified: boolean
}

export type { User, Role };