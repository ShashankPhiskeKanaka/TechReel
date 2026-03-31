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

interface UserUpdateData {
    email?: string,
    username?: string,
    authProvider?: string
    role?: Role
    verified?: boolean
    password?: string
}

export type { User, Role, UserData, UserUpdateData };