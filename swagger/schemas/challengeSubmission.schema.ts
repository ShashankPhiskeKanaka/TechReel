const ChallengeSubmissionSchema = {
    ChallengeSubmission: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            challengeId: { type: "string", format: "uuid" },
            answer: { type: "string" },
            isCorrect: { type: "boolean" },
            score: { type: "number" },
            roadmapStepId: {
                type: "string",
                format: "uuid",
                nullable: true
            },
            createdAt: { type: "string", format: "date-time" }
        }
    }
}

export { ChallengeSubmissionSchema }