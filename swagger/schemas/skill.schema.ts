const SkillSchema = {
    Skill: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            category: { type: "string", nullable: true },
            description: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true }
        }
    }
};

export { SkillSchema }