const challengeSubmissionDocs = {
    "/v1/challenge-submission": {
        post: {
            summary: "Submit a challenge answer",
            tags: ["ChallengeSubmission"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "userId",
                                "challengeId",
                                "answer"
                            ],
                            properties: {
                                userId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "user-uuid"
                                },
                                challengeId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "challenge-uuid"
                                },
                                answer: {
                                    type: "string",
                                    example: "function sum(a, b) { return a + b; }"
                                },
                                roadmapStepId: {
                                    type: "string",
                                    format: "uuid",
                                    nullable: true
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Challenge submitted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Submission successful" },
                                    data: { $ref: "#/components/schemas/ChallengeSubmission" }
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
        },

        get: {
            summary: "Fetch all challenge submissions",
            tags: ["ChallengeSubmission"],
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
                    name: "challengeId",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "roadmapStepId",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "isCorrect",
                    in: "query",
                    schema: { type: "boolean" }
                }
            ],
            responses: {
                200: {
                    description: "Submissions fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Submissions fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/ChallengeSubmission" }
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
        }
    },

    "/v1/challenge-submission/{id}": {
        get: {
            summary: "Get challenge submission by ID",
            tags: ["ChallengeSubmission"],
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
                    description: "Submission fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Submission fetched successfully" },
                                    data: { $ref: "#/components/schemas/ChallengeSubmission" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Submission not found"
                }
            }
        },

        delete: {
            summary: "Delete challenge submission",
            tags: ["ChallengeSubmission"],
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
                    description: "Submission deleted successfully"
                },
                404: {
                    description: "Submission not found"
                }
            }
        }
    }
};

export { challengeSubmissionDocs };