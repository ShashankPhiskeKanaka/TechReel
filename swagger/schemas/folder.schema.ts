const FolderSchema = {
    Folder: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            name: { type: "string", example: "My Project Reels" },
            createdAt: { type: "string", format: "date-time" }
        }
    }
};

export { FolderSchema };
