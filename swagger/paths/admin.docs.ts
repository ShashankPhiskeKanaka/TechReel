const adminDocs = {
    "/v1/admin": {
        post: {
            summary: "Create Admin",
            description: "Registers a new administrative user. This endpoint is typically restricted to existing Super Admins.",
            tags: ["Admin"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "username", "password", "role"],
                            properties: {
                                email: { type: "string", example: "admin2@gmail.com" },
                                username: { type: "string", example: "admin2" },
                                password: { type: "string", example: "Admin@123" },
                                role: {
                                    type: "string",
                                    enum: ["ADMIN"],
                                    example: "ADMIN"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Admin created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Admin user created" },
                                    data: { $ref: "#/components/schemas/User" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Invalid input data",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: false },
                                    message: { type: "string", example: "Please provide valid data" }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: "Forbidden - Insufficient permissions",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: false },
                                    message: { type: "string", example: "Only admins can perform this action" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export { adminDocs };
