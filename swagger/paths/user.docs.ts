const userPaths = {
    "/v1/user": {
        post: {
            summary: "Create new user",
            tags: ["User"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "username", "password"],
                            properties: {
                                email: { type: "string", format: "email", example: "abc@gmail.com" },
                                username: { type: "string", example: "username" },
                                password: { type: "string", example: "Sample@1234" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "User created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "User created successfully" },
                                    data: { $ref: "#/components/schemas/User" }
                                }
                            }
                        }
                    },
                },
                400: {
                    description: "Error",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
                }
            }
        },
        get: {
            summary: "Fetch users",
            tags: ["User"],
            parameters: [
                { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
                { name: "sort", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
                { name: "search", in: "query", schema: { type: "string" } },
                { name: "lastId", in: "query", schema: { type: "string", format: "uuid" } },
                { name: "lastCreatedAt", in: "query", schema: { type: "string", format: "date-time" } }
            ],
            responses: {
                200: {
                    description: "Users fetched",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/User" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/v1/user/{id}": {
        get: {
            summary: "Fetch user by ID",
            tags: ["User"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
            ],
            responses: {
                200: {
                    description: "User fetched",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: { $ref: "#/components/schemas/User" } 
                                }
                            }
                        }
                    }
                }
            }
        },
        patch: {
            summary: "Update user",
            tags: ["User"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                email: { type: "string", format: "email" },
                                role: { type: "string", enum: ["USER", "ADMIN", "CREATOR"] }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User updated",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: { $ref: "#/components/schemas/User" } 
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export { userPaths };
