const feedDocs = {
    "/v1/feed/": {
        get: {
            summary: "Fetch Feed",
            description: "Retrieves a list of public reels/posts. Supports pagination.",
            tags: ["Feed"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: { type: "integer", default: 10 },
                    description: "Number of items per page"
                },
                {
                    name: "lastId",
                    in: "query",
                    required: false,
                    schema: { type: "string" },
                    description: "Id of the last record"
                },
                {
                    name: "lastCreatedAt",
                    in: "query",
                    required: false,
                    schema: { type: "string" },
                    description: "CreatedAt date of last record"
                }
            ],
            responses: {
                200: {
                    description: "Feed fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Feed retrieved" },
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                title: { type: "string" },
                                                url: { type: "string" },
                                                thumbnail: { type: "string" },
                                                createdAt: { type: "string", format: "date-time" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: false },
                                    message: { type: "string", example: "Error fetching feed" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export { feedDocs };
