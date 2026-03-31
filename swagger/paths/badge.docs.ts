const badgeDocs = {
    "/v1/badge": {
        post: {
            summary: "Create a new badge",
            tags: ["Badge"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["skillId", "name", "xpReward"],
                            properties: {
                                skillId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "skill-uuid",
                                    description: "Associated skill ID"
                                },
                                name: {
                                    type: "string",
                                    example: "React Beginner",
                                    description: "Name of the badge"
                                },
                                description: {
                                    type: "string",
                                    nullable: true,
                                    example: "Awarded for completing beginner challenges"
                                },
                                iconUrl: {
                                    type: "string",
                                    format: "uri",
                                    nullable: true,
                                    example: "https://cdn.com/badges/react.png"
                                },
                                xpReward: {
                                    type: "number",
                                    example: 100,
                                    description: "XP reward for earning this badge"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Badge created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Badge created successfully" },
                                    data: { $ref: "#/components/schemas/Badge" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request"
                },
                500: {
                    description: "Internal Server Error"
                }
            }
        }
    },

    "/v1/badge/": {
        get: {
            summary: "Fetch all badges",
            tags: ["Badge"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", default: 10 }
                },
                {
                    name: "lastId",
                    in: "query",
                    schema: { type: "string", format: "uuid" }
                },
                {
                    name: "lastCreatedAt",
                    in: "query",
                    schema: { type: "string", format: "date-time" }
                },
                {
                    name: "search",
                    in: "query",
                    schema: { type: "string" },
                    description: "Search across name/description"
                },
                {
                    name: "skillId",
                    in: "query",
                    schema: { type: "string", format: "uuid" }
                },
                {
                    name: "minXp",
                    in: "query",
                    schema: { type: "number" }
                },
                {
                    name: "maxXp",
                    in: "query",
                    schema: { type: "number" }
                }
            ],
            responses: {
                200: {
                    description: "Badges fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Badges fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Badge" }
                                            },
                                            nextCursor: {
                                                type: "object",
                                                nullable: true,
                                                properties: {
                                                    lastId: { type: "string", format: "uuid" },
                                                    lastCreatedAt: { type: "string", format: "date-time" }
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

    "/v1/badge/{id}": {
        get: {
            summary: "Get badge by ID",
            tags: ["Badge"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string", format: "uuid" }
                }
            ],
            responses: {
                200: {
                    description: "Badge fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Badge fetched successfully" },
                                    data: { $ref: "#/components/schemas/Badge" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Badge not found"
                }
            }
        },

        patch: {
            summary: "Update badge",
            tags: ["Badge"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string", format: "uuid" }
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                skillId: { type: "string", format: "uuid" },
                                name: { type: "string" },
                                description: { type: "string" },
                                iconUrl: { type: "string", format: "uri" },
                                xpReward: { type: "number" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Badge updated successfully"
                }
            }
        },

        delete: {
            summary: "Delete badge",
            tags: ["Badge"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string", format: "uuid" }
                }
            ],
            responses: {
                200: {
                    description: "Badge deleted successfully"
                }
            }
        }
    }
};

export { badgeDocs };