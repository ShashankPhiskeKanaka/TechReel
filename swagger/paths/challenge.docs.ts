const challengeDocs = {
    "/v1/challenge": {
        post: {
            summary: "Create a new challenge",
            tags: ["Challenge"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "reelId",
                                "question",
                                "language",
                                "challengeType",
                                "answer",
                                "difficultyLevel"
                            ],
                            properties: {
                                reelId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "reel-uuid"
                                },
                                question: {
                                    type: "string",
                                    example: "What is the output of this code?"
                                },
                                codeSnippet: {
                                    type: "string",
                                    nullable: true,
                                    example: "console.log(1 + '1');"
                                },
                                language: {
                                    type: "string",
                                    example: "javascript"
                                },
                                challengeType: {
                                    type: "string",
                                    example: "MCQ"
                                },
                                answer: {
                                    type: "string",
                                    example: "11"
                                },
                                difficultyLevel: {
                                    type: "string",
                                    example: "EASY"
                                },
                                options: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    },
                                    example: ["1", "11", "2", "Error"]
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Challenge created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Challenge created successfully" },
                                    data: { $ref: "#/components/schemas/Challenge" }
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
                    description: "Internal Server Error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                }
            }
        }
    },

    "/v1/challenge/": {
        get: {
            summary: "Fetch all challenges",
            tags: ["Challenge"],
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
                    name: "reelId",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "difficultyLevel",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "challengeType",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "search",
                    in: "query",
                    description: "Search in question",
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Challenges fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Challenges fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Challenge" }
                                            },
                                            nextCursor: {
                                                type: "object",
                                                nullable: true,
                                                properties: {
                                                    lastId: { type: "string" },
                                                    lastCreatedAt: { type: "string", format: "date-time" }
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

    "/v1/challenge/{id}": {
        get: {
            summary: "Get challenge by ID",
            tags: ["Challenge"],
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
                    description: "Challenge fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Challenge fetched successfully" },
                                    data: { $ref: "#/components/schemas/Challenge" }
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

        patch: {
            summary: "Update challenge",
            tags: ["Challenge"],
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
                                question: { type: "string" },
                                codeSnippet: { type: "string" },
                                language: { type: "string" },
                                challengeType: { type: "string" },
                                answer: { type: "string" },
                                difficultyLevel: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Updated successfully"
                }
            }
        },

        delete: {
            summary: "Delete challenge",
            tags: ["Challenge"],
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
    }
};

export { challengeDocs };