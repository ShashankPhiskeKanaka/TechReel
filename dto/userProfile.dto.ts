import type { JsonValue } from "@prisma/client/runtime/client"

interface UserProfile {
    id: string
    user_id: string,
    name: string | null,
    bio: string | null,
    avatar_url: string | null,
    skills_summary: string | null,
    xp: number,
    interests: JsonValue,
}

interface UserProfileData {
    name?: string,
    bio?: string,
    avatar_url?: string,
    skills_summary?: string,
    interests?: JsonValue
}

export type { UserProfile, UserProfileData }
