const skillRoadmapDocs = {
    "/v1/skill-roadmap": {
        post: {
            summary: "Create a new skill roadmap",
            tags: ["SkillRoadmap"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "skillId",
                                "difficultyLevel",
                                "title",
                                "description",
                                "tokenId"
                            ],
                            properties: {
                                skillId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "skill-uuid"
                                },
                                difficultyLevel: {
                                    type: "string",
                                    example: "EASY"
                                },
                                title: {
                                    type: "string",
                                    example: "JavaScript Basics Roadmap"
                                },
                                description: {
                                    type: "string",
                                    example: "Covers fundamentals like variables, functions, closures"
                                },
                                tokenId: {
                                    type: "string",
                                    format: "uuid",
                                    example: "token-uuid"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Skill roadmap created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skill roadmap created successfully" },
                                    data: { $ref: "#/components/schemas/SkillRoadmap" }
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

    "/v1/skill-roadmap/": {
        get: {
            summary: "Fetch all skill roadmaps",
            tags: ["SkillRoadmap"],
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
                    name: "skillId",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "difficultyLevel",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "tokenId",
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
                    description: "Skill roadmaps fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skill roadmaps fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/SkillRoadmap" }
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

    "/v1/skill-roadmap/{id}": {
        get: {
            summary: "Get skill roadmap by ID",
            tags: ["SkillRoadmap"],
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
                    description: "Skill roadmap fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skill roadmap fetched successfully" },
                                    data: { $ref: "#/components/schemas/SkillRoadmap" }
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
            summary: "Update skill roadmap",
            tags: ["SkillRoadmap"],
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
                                skillId: { type: "string" },
                                difficultyLevel: { type: "string" },
                                title: { type: "string" },
                                description: { type: "string" },
                                tokenId: { type: "string" }
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
            summary: "Delete skill roadmap",
            tags: ["SkillRoadmap"],
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

export { skillRoadmapDocs };