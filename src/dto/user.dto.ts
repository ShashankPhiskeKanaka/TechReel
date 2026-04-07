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
class PublicUser {
    id: string;
    email: string;
    username: string;
    role: Role;
    verified: boolean;
    createdAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.username = user.username;
        this.role = user.role;
        this.verified = user.verified;
        this.createdAt = user.createdAt;
    }
}

export type { User, Role, UserData, UserUpdateData };
export { PublicUser }