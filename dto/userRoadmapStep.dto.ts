interface UserRoadmapStepData {
    userId: string
    roadmapStepId: string
}

interface UserRoadmapStep {
    id: string
    userId: string
    roadmapStepId: string
    roadmapId: string
    stepOrder: number
    createdAt: Date
}

export type { UserRoadmapStepData, UserRoadmapStep }