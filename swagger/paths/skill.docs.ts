const skillDocs = {
    "/v1/skill": {
        post: {
            summary: "Create a new skill",
            tags: ["Skill"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name"],
                            properties: {
                                name: {
                                    type: "string",
                                    example: "React",
                                    description: "Name of the skill"
                                },
                                category: {
                                    type: "string",
                                    example: "Frontend",
                                    description: "Category of the skill"
                                },
                                description: {
                                    type: "string",
                                    example: "Library for building UI",
                                    description: "Description of the skill"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Skill created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skill created successfully" },
                                    data: { $ref: "#/components/schemas/Skill" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request",
                    content: {
                        "application/json": {
                            example: { success: false, message: "please provide valid data", data: null }
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
        },
        get: {
            summary: "Fetch all skills",
            tags: ["Skill"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: { type: "integer", default: 10 }
                },
                {
                    name: "lastId",
                    in: "query",
                    required: false,
                    schema: { type: "string", format: "uuid" }
                },
                {
                    name: "lastCreatedAt",
                    in: "query",
                    required: false,
                    schema: { type: "string", format: "date-time" }
                },
                {
                    name: "search",
                    in: "query",
                    required: false,
                    schema: { type: "string" },
                    description: "Search across name/category/description"
                },
                {
                    name: "category",
                    in: "query",
                    required: false,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Skills fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skills fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Skill" }
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

    "/v1/skill/{id}": {
        get: {
            summary: "Get skill by ID",
            tags: ["Skill"],
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
                    description: "Skill fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Skill fetched successfully" },
                                    data: { $ref: "#/components/schemas/Skill" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Skill not found"
                }
            }
        },

        patch: {
            summary: "Update skill",
            tags: ["Skill"],
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
                                name: { type: "string" },
                                category: { type: "string" },
                                description: { type: "string" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Skill updated successfully"
                }
            }
        },

        delete: {
            summary: "Delete skill",
            tags: ["Skill"],
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
                    description: "Skill deleted successfully"
                }
            }
        }
    }
};

export { skillDocs };