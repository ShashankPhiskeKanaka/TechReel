const likeDocs = {
    "/v1/like": {
        post: {
            summary: "Like a reel",
            tags: ["Like"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userId", "reelId"],
                            properties: {
                                userId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "user-uuid"
                                },
                                reelId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "reel-uuid"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Reel liked successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Reel liked successfully" },
                                    data: { $ref: "#/components/schemas/Like" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request",
                    content: {
                        "application/json": {
                            example: { success: false, message: "Invalid data", data: null }
                        }
                    }
                },
                409: {
                    description: "Already liked",
                    content: {
                        "application/json": {
                            example: { success: false, message: "Reel already liked", data: null }
                        }
                    }
                },
                500: {
                    description: "Internal Server Error"
                }
            }
        },

        get: {
            summary: "Fetch likes (user or reel based)",
            tags: ["Like"],
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
                },
                {
                    name: "reelId",
                    in: "query",
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Likes fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Likes fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Like" }
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
                },
                500: {
                    description: "Internal Server Error"
                }
            }
        }
    },

    "/v1/like/{id}": {
        get: {
            summary: "Get like by ID",
            tags: ["Like"],
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
                    description: "Like fetched successfully"
                },
                404: {
                    description: "Not found"
                }
            }
        },
        delete: {
            summary: "Unlike a reel",
            tags: ["Like"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userId", "reelId"],
                            properties: {
                                userId: {
                                    type: "string",
                                    format: "uuid"
                                },
                                reelId: {
                                    type: "string",
                                    format: "uuid"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Reel unliked successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Reel unliked successfully" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Like not found"
                }
            }
        },
    },

    "/v1/like/count/{reelId}": {
        get: {
            summary: "Get total like count for a reel",
            tags: ["Like"],
            parameters: [
                {
                    name: "reelId",
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
                    description: "Like count fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Like count fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            reelId: { type: "string" },
                                            likeCount: {
                                                type: "integer",
                                                example: 542
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
};

export { likeDocs };