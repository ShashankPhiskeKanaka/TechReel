const skillRoadmapStepDocs = {
    "/v1/skill-roadmap-step": {
        post: {
            summary: "Create a new skill roadmap step",
            tags: ["SkillRoadmapStep"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "roadmapId",
                                "reelId",
                                "challengeId",
                                "stepOrder",
                                "title"
                            ],
                            properties: {
                                roadmapId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "roadmap-uuid"
                                },
                                reelId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "reel-uuid"
                                },
                                challengeId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "challenge-uuid"
                                },
                                stepOrder: {
                                    type: "integer",
                                    example: 1,
                                    description: "Defines order of the step in roadmap"
                                },
                                title: {
                                    type: "string",
                                    example: "Introduction to Closures"
                                },
                                description: {
                                    type: "string",
                                    nullable: true,
                                    example: "Understand closures with examples"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Skill roadmap step created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skill roadmap step created successfully" },
                                    data: { $ref: "#/components/schemas/SkillRoadmapStep" }
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
            summary: "Fetch all skill roadmap steps",
            tags: ["SkillRoadmapStep"],
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
                    name: "roadmapId",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "reelId",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "challengeId",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "search",
                    in: "query",
                    description: "Search in title",
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Skill roadmap steps fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skill roadmap steps fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/SkillRoadmapStep" }
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


    "/v1/skill-roadmap-step/{id}": {
        get: {
            summary: "Get skill roadmap step by ID",
            tags: ["SkillRoadmapStep"],
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
                    description: "Fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skill roadmap step fetched successfully" },
                                    data: { $ref: "#/components/schemas/SkillRoadmapStep" }
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
            summary: "Update skill roadmap step",
            tags: ["SkillRoadmapStep"],
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
                                roadmapId: { type: "string" },
                                reelId: { type: "string" },
                                challengeId: { type: "string" },
                                stepOrder: { type: "integer" },
                                title: { type: "string" },
                                description: { type: "string", nullable: true }
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
            summary: "Delete skill roadmap step",
            tags: ["SkillRoadmapStep"],
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

export { skillRoadmapStepDocs };