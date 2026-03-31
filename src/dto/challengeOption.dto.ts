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

export type { ChallengeOption, ChallengeOptionData }