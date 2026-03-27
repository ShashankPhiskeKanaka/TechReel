interface ChallengeSubmission {
    id: string
    userId: string
    challengeId: string
    answer: string
    isCorrect: boolean
    score: number
    roadmapStepId: string | null
    createdAt: Date
}

interface ChallengeSubmissionData {
    userId: string
    challengeId: string
    answer: string
    isCorrect: boolean
    score: number
    roadmapStepId: string | null
}

export type { ChallengeSubmission, ChallengeSubmissionData }