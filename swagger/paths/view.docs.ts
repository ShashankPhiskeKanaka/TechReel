const viewDocs = {
    "/v1/view": {
        post: {
            summary: "create a view record",
            tags: ["View"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userId", "reelId", "watchedSeconds", "completed"],
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
                                },
                                watchedSeconds: {
                                    type: "number",
                                    example: 12.5,
                                    description: "Total seconds watched"
                                },
                                completed: {
                                    type: "boolean",
                                    example: false,
                                    description: "Whether user completed the reel"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "View tracked successfully (upsert behavior)",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "View tracked successfully" },
                                    data: { $ref: "#/components/schemas/View" }
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
                500: {
                    description: "Internal Server Error"
                }
            }
        },
        get: {
            summary: "Fetch views (analytics / history)",
            tags: ["View"],
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
                },
                {
                    name: "completed",
                    in: "query",
                    schema: { type: "boolean" }
                }
            ],
            responses: {
                200: {
                    description: "Views fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Views fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/View" }
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

    "/v1/view/{id}": {
        get: {
            summary: "Get view by ID",
            tags: ["View"],
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
                    description: "View fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "View fetched successfully" },
                                    data: { $ref: "#/components/schemas/View" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Not found"
                }
            }
        },

        delete: {
            summary: "Delete view record",
            tags: ["View"],
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
                    description: "Deleted successfully"
                }
            }
        }
    },
    "/v1/view/count/{reelId}": {
        get: {
            summary: "Get total view count for a reel",
            tags: ["View"],
            parameters: [
                {
                    name: "reelId",
                    in: "path",
                    required: true,
                    description: "The unique ID of the reel",
                    schema: {
                        type: "string",
                        format: "uuid"
                    }
                }
            ],
            responses: {
                200: {
                    description: "View count fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "View count fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            reelId: {
                                                type: "string",
                                                format: "uuid",
                                                example: "reel-uuid"
                                            },
                                            viewCount: {
                                                type: "integer",
                                                example: 1245,
                                                description: "Total number of views for the reel"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Reel not found",
                    content: {
                        "application/json": {
                            example: {
                                success: false,
                                message: "Reel not found",
                                data: null
                            }
                        }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                }
            }
        }
    }
};

export { viewDocs };