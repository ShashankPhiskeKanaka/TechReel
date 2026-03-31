const UserProfileSchemas = {
    UserProfile: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            name: { type: "string", nullable: true },
            bio: { type: "string", nullable: true },
            avatarUrl: { type: "string", format: "uri", nullable: true },
            skillsSummary: { type: "string", nullable: true },
            xp: { type: "integer", example: 0 },
            interests: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" }
        }
    },
}

export { UserProfileSchemas }