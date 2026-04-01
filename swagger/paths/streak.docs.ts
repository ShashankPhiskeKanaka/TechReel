const streakDocs = {
    "/v1/streak": {
        post: {
            summary: "Create a new streak",
            tags: ["Streak"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userId", "currentStreak", "longestStreak"],
                            properties: {
                                userId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "user-uuid"
                                },
                                currentStreak: {
                                    type: "integer",
                                    example: 5
                                },
                                longestStreak: {
                                    type: "integer",
                                    example: 10
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Streak created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Streak created successfully" },
                                    data: { $ref: "#/components/schemas/Streak" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request"
                },
                409: {
                    description: "Streak already exists for user"
                }
            }
        },
        get: {
            summary: "Fetch all streaks",
            tags: ["Streak"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", default: 10 }
                },
                {
                    name: "lastId",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "lastCreatedAt",
                    in: "query",
                    schema: { type: "string", format: "date-time" }
                },
                {
                    name: "userId",
                    in: "query",
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Streaks fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Streaks fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Streak" }
                                            },
                                            nextCursor: {
                                                type: "object",
                                                nullable: true,
                                                properties: {
                                                    lastId: { type: "string" },
                                                    lastCreatedAt: {
                                                        type: "string",
                                                        format: "date-time"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        patch: {
            summary: "Update user streak",
            tags: ["Streak"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userId"],
                            properties: {
                                userId: {
                                    type: "string",
                                    format: "uuid"
                                },
                                currentStreak: {
                                    type: "integer",
                                    example: 6
                                },
                                longestStreak: {
                                    type: "integer",
                                    example: 12
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Streak updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Streak updated successfully" },
                                    data: { $ref: "#/components/schemas/Streak" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Streak not found"
                }
            }
        }
    },

    "/v1/streak/{id}": {
        get: {
            summary: "Get streak by ID",
            tags: ["Streak"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Streak fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Streak fetched successfully" },
                                    data: { $ref: "#/components/schemas/Streak" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Streak not found"
                }
            }
        }
    }
};

export { streakDocs };