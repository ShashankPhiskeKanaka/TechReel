import type { challenge_type } from "../generated/prisma/enums.js"
import type { Difficulty } from "./reel.dto.js"

interface Challenge {
    id: string
    reelId: string
    question: string
    codeSnippet: string | null
    language: string
    challengeType: challenge_type
    answer: string
    difficultyLevel: Difficulty
    createdAt: Date
    deletedAt: Date | null
}

interface ChallengeData {
    reelId: string
    question: string
    codeSnippet: string | null
    language: string
    challengeType: challenge_type
    answer: string
    difficultyLevel: Difficulty
    options: any
}

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

interface ChallengeOption {
    id: string
    challengeId: string
    isCorrect: boolean
    option: string
}

interface ChallengeOptionData {
    isCorrect?: boolean
    options?: string
}

export type { Challenge, ChallengeData, ChallengeSubmission, ChallengeSubmissionData, ChallengeOptionData, ChallengeOption }