const UserSchema = {
    User: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email", example: "user@example.com" },
            username: { type: "string", example: "johndoe" },
            role: {
                type: "string",
                enum: ["ADMIN", "USER", "CREATOR"],
                example: "USER"
            },
            verified: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            password: { type: "string", writeOnly: true },
            authProvider: { type: "string", example: "google" },
            deletedAt: { type: "string", format: "date-time", nullable: true }
        }
    }
};

export { UserSchema };
