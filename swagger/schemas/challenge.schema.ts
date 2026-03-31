const ChallengeSchema = {
    Challenge: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            reelId: { type: "string", format: "uuid" },
            question: { type: "string" },
            codeSnippet: { type: "string", nullable: true },
            language: { type: "string" },
            challengeType: {
                type: "string",
                enum: ["MCQ", "FIB", "TF", "OP"]
            },
            answer: { type: "string" },
            difficultyLevel: {
                type: "string",
                enum: ["NOVICE", "COMPETENT", "PROFICIENT"]
            },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true }
        }
    }
}

export { ChallengeSchema }