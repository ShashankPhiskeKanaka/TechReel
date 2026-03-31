const tokenDocs = {
    "/v1/token": {
        post: {
            summary: "Create a new token",
            tags: ["Token"],
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
                                    example: "sample",
                                    description: "The name for the new token"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Token created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Token created successfully" },
                                    data: { $ref: "#/components/schemas/Token" }
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
                403: {
                    description: "Forbidden",
                    content: {
                        "application/json": {
                            example: { success: false, message: "Forbidden!", data: null }
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
    "/v1/token/": {
        get: {
            summary: "Fetch all tokens",
            tags: ["Token"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    description: "Number of tokens to return",
                    required: false,
                    schema: { type: "integer", default: 10 }
                },
                {
                    name: "lastId",
                    in: "query",
                    description: "Cursor ID for pagination",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "lastCreatedAt",
                    in: "query",
                    description: "Cursor timestamp for pagination",
                    required: false,
                    schema: { type: "string", format: "date-time" }
                }
            ],
            responses: {
                200: {
                    description: "Tokens fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Tokens fetched successfully" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            records: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Token" }
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
    "/v1/token/{id}": {
        get: {
            summary: "Get token by ID",
            tags: ["Token"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The unique ID of the token",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            responses: {
                200: {
                    description: "Token fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Token fetched successfully" },
                                    data: { $ref: "#/components/schemas/Token" }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: "Forbidden",
                    content: {
                        "application/json": {
                            example: {
                                success: false,
                                message: "Forbidden!",
                                data: null
                            }
                        }
                    }
                },
                404: {
                    description: "Resource Not Found",
                    content: {
                        "application/json": {
                            example: {
                                success: false,
                                message: "Resource not found!",
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
        },
        patch: {
            summary: "Update token details",
            tags: ["Token"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The unique ID of the token to update",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            requestBody: {
                description: "Fields to update in the token",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    description: "New name for the token"
                                },
                                tokenUrl: {
                                    type: "string",
                                    format: "uri",
                                    description: "New URL for the token"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Token updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Token updated successfully" },
                                    data: { $ref: "#/components/schemas/Token" }
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
        },
        delete: {
            summary: "Delete token",
            tags: ["Token"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The unique ID of the token to delete",
                    schema: { type: "string", format: "uuid" }
                }
            ],
            requestBody: {
                description: "Deletion options",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                flag: {
                                    type: "boolean",
                                    description: "Confirmation flag for deletion (e.g., true for soft delete, false for permanent)",
                                    example: true
                                }
                            },
                            required: ["flag"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Token deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Token deleted successfully" },
                                    data: { $ref: "#/components/schemas/Token" }
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
    }
};

export { tokenDocs }