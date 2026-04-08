const UserRoadmapStepSchema = {
    UserRoadmapStep: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            roadmapStepId: { type: "string", format: "uuid" },
            roadmapId: { type: "string", format: "uuid" },
            stepOrder: { type: "integer", example: 1 },
            name: { type: "string", example: "Introduction to Node.js" }, // Field selection included
            createdAt: { type: "string", format: "date-time" }
        }
    }
};

export { UserRoadmapStepSchema };
