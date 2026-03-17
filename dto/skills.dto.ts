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
    created_at: Date,
    deleted_at: Date | null
}

export type { Skill, SkillData };