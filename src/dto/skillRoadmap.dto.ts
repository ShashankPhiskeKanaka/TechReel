import type { Difficulty } from "./reel.dto.js"

interface SkillRoadmap {
    id: string
    skillId: string
    difficultyLevel: Difficulty
    title: string
    description: string
    createdAt: Date
    tokenId: string
}

interface SkillRoadmapData {
    skillId: string
    difficultyLevel: Difficulty
    title: string
    description: string
    tokenId: string
}

export type { SkillRoadmap, SkillRoadmapData }