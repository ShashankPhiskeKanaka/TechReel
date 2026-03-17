type Role = "ADMIN" | "USER" | "CREATOR"

interface User {
    id: string
    email: string
    username: string
    password: string
    auth_provider: string
    created_at: Date
    deleted_at: Date | null
    role: Role
    verified: boolean
}

interface UserData {
    email: string,
    username: string,
    password: string
}

export type { User, Role, UserData };