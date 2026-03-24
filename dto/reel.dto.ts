import type { InputJsonValue, JsonValue } from "@prisma/client/runtime/client"
import type { NullableJsonNullValueInput } from "../generated/prisma/internal/prismaNamespace.js"

type Difficulty = "NOVICE" | "COMPETENT" | "PROFICIENT"
type Status = "PENDING" | "UPLOADED" | "FAILED"
interface ReelData {
    id: string
    title: string
    description : string | null
    videoUrl : string | null
    creatorId : string
    skillId: string
    difficultyLevel: Difficulty
    tags: NullableJsonNullValueInput | InputJsonValue
    isBonus: boolean
}

interface ReelUpdateData {
    title: string | null
    description : string | null
    videoUrl : string | null
    creatorId : string | null
    skillId: string | null
    difficultyLevel: Difficulty | null
    tags: NullableJsonNullValueInput | InputJsonValue
    isBonus: boolean | null
}

interface Reel {
    id: string
    title: string
    description: string | null
    videoUrl: string | null
    creatorId: string
    skillId: string
    difficultyLevel: Difficulty
    createdAt: Date
    deletedAt: Date | null
    duration: Number
    tags: JsonValue | null
    views: Number
    status: Status
    thumbnailUrl: string | null
    isBonus: boolean
}

export type { Reel, ReelData, Status, Difficulty, ReelUpdateData };