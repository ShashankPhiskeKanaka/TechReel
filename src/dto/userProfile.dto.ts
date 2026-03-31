import type { JsonValue } from "@prisma/client/runtime/client"

interface UserProfile {
    id: string
    userId: string,
    name: string | null,
    bio: string | null,
    avatarUrl: string | null,
    skillsSummary: string | null,
    xp: number,
    interests: JsonValue,
}

interface UserProfileData {
    name?: string,
    bio?: string,
    avatarUrl?: string,
    skillsSummary?: string,
    interests?: JsonValue
}

export type { UserProfile, UserProfileData }
