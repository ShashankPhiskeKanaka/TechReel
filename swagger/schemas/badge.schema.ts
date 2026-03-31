const BadgeSchema = {
    Badge: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            skillId: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            iconUrl: { type: "string", nullable: true },
            xpReward: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true }
        }
    }
};

export { BadgeSchema }