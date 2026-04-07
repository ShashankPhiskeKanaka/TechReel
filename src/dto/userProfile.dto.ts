import type { InputJsonValue, JsonNullClass, JsonValue } from "@prisma/client/runtime/client"

interface UserProfile {
    id: string
    userId: string,
    name: string | null,
    bio: string | null,
    skillsSummary: string | null,
    xp: number,
    interests: JsonValue,
}

interface UserProfileData {
    name?: string,
    bio?: string,
    skillsSummary?: string,
    interests: InputJsonValue | JsonNullClass
}

export type { UserProfile, UserProfileData }
