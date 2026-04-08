const ReelSchema = {
    Reel: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", example: "Mastering Node.js Streams" },
            description: { type: "string", nullable: true },
            videoUrl: { type: "string", format: "uri", nullable: true },
            thumbnailUrl: { type: "string", format: "uri", nullable: true },
            creatorId: { type: "string", format: "uuid" },
            skillId: { type: "string", format: "uuid" },
            difficultyLevel: { type: "string", enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] },
            duration: { type: "number", example: 120 },
            views: { type: "number", default: 0 },
            status: { type: "string", enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
            isBonus: { type: "boolean", default: false },
            tags: { type: "array", items: { type: "string" }, nullable: true },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true }
        }
    }
};

export { ReelSchema };
