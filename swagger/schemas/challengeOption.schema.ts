const ChallengeOptionSchema = {
    ChallengeOption: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            challengeId: { type: "string", format: "uuid" },
            isCorrect: { type: "boolean" },
            option: { type: "string" }
        }
    }
}

export { ChallengeOptionSchema }