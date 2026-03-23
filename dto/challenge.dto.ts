import type { challenge_type } from "../generated/prisma/enums.js"
import type { Difficulty } from "./reel.dto.js"

interface Challenge {
    id: string
    reel_id: string
    question: string
    code_snippet: string | null
    language: string
    challenge_type: challenge_type
    answer: string
    difficulty_level: Difficulty
    created_at: Date
    deleted_at: Date | null
}

interface ChallengeData {
    reel_id: string
    question: string
    code_snippet: string | null
    language: string
    challenge_type: challenge_type
    answer: string
    difficulty_level: Difficulty
}

interface ChallengeSubmission {
    id: string
    user_id: string
    challenge_id: string
    answer: string
    is_correct: boolean
    score: number
    roadmap_step_id: string | null
    created_at: Date
}

interface ChallengeSubmissionData {
    user_id: string
    challenge_id: string
    answer: string
    is_correct: boolean
    score: number
    roadmap_step_id: string | null
}

export type { Challenge, ChallengeData, ChallengeSubmission, ChallengeSubmissionData }