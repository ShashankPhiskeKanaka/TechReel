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

export type { Challenge, ChallengeData }