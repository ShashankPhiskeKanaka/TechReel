const UserBadgeSchema = {
    UserBadge: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            badgeId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" }
        }
    }
};

export { UserBadgeSchema };
