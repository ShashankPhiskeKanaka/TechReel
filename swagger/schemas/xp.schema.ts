const XpSchema = {
    Xp: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            amount: { type: "integer", example: 100 },
            source: { type: "string", example: "DAILY_LOGIN" },
            type: {
                type: "string",
                enum: ["CREDIT", "DEBIT"],
                description: "CREDIT adds XP, DEBIT subtracts XP"
            },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true }
        }
    }
};

export { XpSchema };
