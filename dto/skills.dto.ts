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

interface SkillRoadmap {
    id: string
    skillId: string
    difficultyLevel: Difficulty
    title: string
    description: string
    createdAt: Date
}

interface SkillRoadmapData {
    skillId: string
    difficultyLevel: Difficulty
    title: string
    description: string
}

interface SkillRoadmapStep {
    id: string
    roadmapId: string
    reelId: string
    challengeId: string
    stepOrder: number
    title: string
    description: string | null
}

interface SkillRoadmapStepData {
    roadmapId: string
    reelId: string
    challengeId: string
    stepOrder: number
    title: string
    description: string | null
}

export type { Skill, SkillData, SkillRoadmap, SkillRoadmapData, SkillRoadmapStep, SkillRoadmapStepData };