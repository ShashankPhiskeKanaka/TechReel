type Role = "ADMIN" | "USER" | "CREATOR"

interface User {
    id: string
    email: string
    username: string
    password: string
    authProvider: string
    createdAt: Date
    deletedAt: Date | null
    role: Role
    verified: boolean
}

interface UserData {
    email: string,
    username: string,
    password: string
}

export type { User, Role, UserData };