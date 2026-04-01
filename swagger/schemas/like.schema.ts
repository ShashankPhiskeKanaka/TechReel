const LikeSchema = {
    Like: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            reelId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" }
        }
    }
}

export { LikeSchema }