const SkillRoadmapStepSchema = {
    SkillRoadmapStep: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            roadmapId: { type: "string", format: "uuid" },
            reelId: { type: "string", format: "uuid" },
            challengeId: { type: "string", format: "uuid" },
            stepOrder: { type: "integer" },
            title: { type: "string" },
            description: { type: "string", nullable: true }
        }
    }
}

export { SkillRoadmapStepSchema }