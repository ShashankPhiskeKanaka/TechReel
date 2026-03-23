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
    created_at: Date,
    deleted_at: Date | null
}

interface SkillRoadmap {
    id: string
    skill_id: string
    difficulty_level: Difficulty
    title: string
    description: string
    created_at: Date
}

interface SkillRoadmapData {
    skill_id: string
    difficulty_level: Difficulty
    title: string
    description: string
}

interface SkillRoadmapStep {
    id: string
    roadmap_id: string
    reel_id: string
    challenge_id: string
    step_order: number
    title: string
    description: string | null
}

interface SkillRoadmapStepData {
    roadmap_id: string
    reel_id: string
    challenge_id: string
    step_order: number
    title: string
    description: string | null
}

export type { Skill, SkillData, SkillRoadmap, SkillRoadmapData, SkillRoadmapStep, SkillRoadmapStepData };