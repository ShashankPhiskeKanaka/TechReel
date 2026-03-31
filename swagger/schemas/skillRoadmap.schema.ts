const SkillRoadmapSchema = {
    SkillRoadmap: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            skillId: { type: "string", format: "uuid" },
            difficultyLevel: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            tokenId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" }
        }
    }
}

export { SkillRoadmapSchema }