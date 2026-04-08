const ReelSaveSchema = {
    ReelSave: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            reelId: { type: "string", format: "uuid" },
            folderId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" }
        }
    }
};

export { ReelSaveSchema };
