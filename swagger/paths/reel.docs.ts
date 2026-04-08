const reelDocs = {
    "/v1/reel": {
        get: {
            summary: "Fetch All Reels",
            description: "Retrieves a paginated list of reels with optional filtering by creator, skill, or difficulty.",
            tags: ["Reels"],
            parameters: [
                { name: "creatorId", in: "query", schema: { type: "string", format: "uuid" } },
                { name: "skillId", in: "query", schema: { type: "string", format: "uuid" } },
                { name: "difficultyLevel", in: "query", schema: { type: "string" } },
                { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
                { name: "sort", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
                { name: "search", in: "query", schema: { type: "string" }, description: "Search by title" },
                { name: "id", in: "query", description: "Cursor ID", schema: { type: "string" } },
                { name: "createdAt", in: "query", description: "Cursor Date", schema: { type: "string", format: "date-time" } }
            ],
            responses: {
                200: {
                    description: "Reels retrieved",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean" },
                                    data: { type: "array", items: { $ref: "#/components/schemas/Reel" } }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: "Get Presigned URL",
            description: "Initializes a reel upload by providing a secure S3 Presigned URL.",
            tags: ["Reels"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["title", "imageType"],
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                skillId: { type: "string", format: "uuid" },
                                difficultyLevel: { type: "string" },
                                imageType: { type: "string", example: "video/mp4" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Presigned URL generated",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    reel: { $ref: "#/components/schemas/Reel" },
                                    uploadUrl: { type: "string", format: "uri" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/v1/reel/{id}": {
        get: {
            summary: "Fetch Specific Reel",
            tags: ["Reels"],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: {
                200: {
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Reel" } } }
                }
            }
        },
        patch: {
            summary: "Update Reel Metadata",
            tags: ["Reels"],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                status: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: "Reel updated" } }
        },
        delete: {
            summary: "Delete Reel",
            tags: ["Reels"],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
            responses: { 200: { description: "Reel removed" } }
        }
    }
};

export { reelDocs };
