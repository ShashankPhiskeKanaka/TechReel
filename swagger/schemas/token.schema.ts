const tokenSchema = {
    Token: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            tokenUrl: { type: "string", format: "uri", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true }
        }
    }
};

export { tokenSchema }