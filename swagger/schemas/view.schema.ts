const ViewSchema = {
    View: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            reelId: { type: "string", format: "uuid" },
            watchedSeconds: { type: "number" },
            completed: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" }
        }
    }
}

export { ViewSchema };