import type { Difficulty } from "./reel.dto.js"

interface SkillData {
    name: string,
    category?: string,
    description?: string
}

interface Skill {
    id: string
    name: string,
    category : string | null
    description: string | null,
    createdAt: Date,
    deletedAt: Date | null
}

export type { Skill, SkillData };