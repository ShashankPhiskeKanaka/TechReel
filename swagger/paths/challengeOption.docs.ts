const challengeOptionDocs = {
    "/v1/challenge-option": {
        get: {
            summary: "Fetch all challenge options",
            tags: ["ChallengeOption"],
            parameters: [
                {
                    name: "challengeId",
                    in: "query",
                    description: "Filter by challenge ID",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            responses: {
                200: {
                    description: "Options fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Options fetched successfully" },
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/ChallengeOption" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    "/v1/challenge-option/options/{id}": {
        get: {
            summary: "Fetch all options for a specific challenge",
            tags: ["ChallengeOption"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Challenge ID",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            responses: {
                200: {
                    description: "Challenge options fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Challenge options fetched successfully" },
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/ChallengeOption" }
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Challenge not found"
                }
            }
        }
    },

    "/v1/challenge-option/{id}": {
        get: {
            summary: "Fetch a specific challenge option",
            tags: ["ChallengeOption"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Option ID",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            responses: {
                200: {
                    description: "Option fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Option fetched successfully" },
                                    data: { $ref: "#/components/schemas/ChallengeOption" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Option not found"
                }
            }
        },

        patch: {
            summary: "Update a challenge option",
            tags: ["ChallengeOption"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Option ID",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                isCorrect: {
                                    type: "boolean",
                                    example: true
                                },
                                option: {
                                    type: "string",
                                    example: "O(n log n)"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Option updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Option updated successfully" },
                                    data: { $ref: "#/components/schemas/ChallengeOption" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Invalid input"
                },
                404: {
                    description: "Option not found"
                }
            }
        }
    }
};

export { challengeOptionDocs };