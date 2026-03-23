import type { InputJsonValue, JsonValue } from "@prisma/client/runtime/client"
import type { NullableJsonNullValueInput } from "../generated/prisma/internal/prismaNamespace.js"

type Difficulty = "NOVICE" | "COMPETENT" | "PROFICIENT"
type Status = "PENDING" | "UPLOADED" | "FAILED"
interface ReelData {
    id: string
    title: string
    description : string | null
    video_url : string | null
    creator_id : string
    skill_id: string
    difficulty_level: Difficulty
    tags: NullableJsonNullValueInput | InputJsonValue
    is_bonus: boolean
}

interface ReelUpdateData {
    title: string | null
    description : string | null
    video_url : string | null
    creator_id : string | null
    skill_id: string | null
    difficulty_level: Difficulty | null
    tags: NullableJsonNullValueInput | InputJsonValue
    is_bonus: boolean | null
}

interface Reel {
    id: string
    title: string
    description: string | null
    video_url: string | null
    creator_id: string
    skill_id: string
    difficulty_level: Difficulty
    created_at: Date
    deleted_at: Date | null
    duration: Number
    tags: JsonValue | null
    views: Number
    status: Status
    thumbnail_url: string | null
    is_bonus: boolean
}

export type { Reel, ReelData, Status, Difficulty, ReelUpdateData };