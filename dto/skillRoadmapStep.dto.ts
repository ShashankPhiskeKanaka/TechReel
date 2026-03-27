import { z } from "zod"

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

export type { SkillRoadmapStep, SkillRoadmapStepData }