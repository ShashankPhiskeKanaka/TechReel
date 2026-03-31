const userProfileDocs = {
    "/v1/user-profile": {
        post: {
            summary: "Create user profile",
            tags: ["User-Profile"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name", "interests"],
                            properties: {
                                name: { type: "string" },
                                bio: { type: "string" },
                                avatar_url: { type: "string", format: "uri" },
                                skills_summary: { type: "string" },
                                interests: {
                                    type: "array",
                                    items: { type: "string" }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User profile created successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserProfile" }
                        }
                    }
                },
                400: {
                    description: "Bad Request",
                    content: {
                        "application/json": {
                            examples: {
                                invalidData: {
                                    summary: "Validation error",
                                    value: { success: false, message: "please provide valid data", data: null }
                                },
                                notFound: {
                                    summary: "Resource not found",
                                    value: { success: false, message: "resource not found", data: null }
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
    "/v1/user-profile/": {
        get: {
            summary: "Fetch user profiles",
            tags: ["User-Profile"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    description: "Number of records to return",
                    required: false,
                    schema: { type: "integer", default: 10 }
                },
                {
                    name: "lastId",
                    in: "query",
                    description: "The ID of the last record from the previous page (cursor)",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "lastCreatedAt",
                    in: "query",
                    description: "The timestamp of the last record from the previous page (cursor)",
                    required: false,
                    schema: { type: "string", format: "date-time" }
                }
            ],
            responses: {
                200: {
                    description: "User Profiles fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "User Profiles fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/UserProfile" }
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
                403: {
                    description: "Forbidden",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: { success: false, message: "Forbidden!", data: null }
                        }
                    }
                },
                404: {
                    description: "Resource Not Found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: { success: false, message: "Resource not found!", data: null }
                        }
                    }
                }
            }
        }
    },
    "/v1/user-profile/{id}": {
        get: {
            summary: "Get user profile by ID",
            tags: ["User-Profile"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The unique ID of the user profile",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            responses: {
                200: {
                    description: "User profile fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "User profile fetched successfully" },
                                    data: { $ref: "#/components/schemas/UserProfile" }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: "Forbidden",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                },
                404: {
                    description: "Resource Not Found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                },
                400: {
                    description: "Invalid data",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                }
            }
        },
        patch: {
            summary: "Update user profile",
            tags: ["User-Profile"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The unique ID of the user profile",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            requestBody: {
                description: "Fields to update in the user profile",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            // No 'required' array here as all Zod fields are .optional()
                            properties: {
                                name: {
                                    type: "string",
                                    description: "Updated name of the user"
                                },
                                bio: {
                                    type: "string",
                                    nullable: true,
                                    description: "Updated biography"
                                },
                                avatar_url: {
                                    type: "string",
                                    format: "uri",
                                    nullable: true,
                                    description: "Updated image URL"
                                },
                                skills_summary: {
                                    type: "string",
                                    nullable: true
                                },
                                interests: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Updated list of interests"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User profile updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "User profile updated successfully" },
                                    data: { $ref: "#/components/schemas/UserProfile" }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad Request / Validation Error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                },
                403: {
                    description: "Forbidden",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                },
                404: {
                    description: "Resource Not Found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
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
        delete: {
            summary: "Delete user profile",
            tags: ["User-Profile"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The unique ID of the user profile to delete",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            responses: {
                200: {
                    description: "User profile deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "User profile deleted successfully" },
                                    data: { $ref: "#/components/schemas/UserProfile" }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: "Forbidden",
                    content: {
                        "application/json": {
                            example: { success: false, message: "Forbidden!", data: null }
                        }
                    }
                },
                404: {
                    description: "Resource Not Found",
                    content: {
                        "application/json": {
                            example: { success: false, message: "Resource not found!", data: null }
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
};

export { userProfileDocs };
