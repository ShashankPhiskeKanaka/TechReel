const userPaths = {
    "/v1/user/": {
        post: {
            summary: "Create new user",
            tags: ["User"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: { type: "string", example: "abc@gmail.com" },
                                username: { type: "string", example: "username" },
                                password: { type: "string", example: "Sample@1234" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Password changed successfully" },
                                    data: { type: "object", nullable: true }
                                }
                            }
                        }
                    },
                },
                400: {
                    description: "Please provide valid data",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                }
            }
        }
    },
    "/v1/user/:token": {
        get: {
            summary: "Verify user email",
            tags: ["User"],
            parameters: [
                {
                    name: "token",
                    in: "path",
                    required: true,
                    schema: { type: "boolean" },
                    description: ""
                }
            ],
            responses: {
                200: {
                    description: "User email verified",
                    content: {
                        "application/json" : {
                            schema: { $ref: "#/components/schemas/BaseSchema" }
                        }
                    }
                },
                400: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {$ref : "#/components/schemas/ErrorSchema"}
                        }
                    }
                }
            }
        }
    },
    "/v1/user/:id": {
        get: {
            summary: "Fetch user",
            tags: ["User"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "boolean" },
                    description: "uuid of user"
                }
            ],
            responses: {
                200: {
                    description: "User fetched",
                    content: {
                        "application/json" : {
                            schema: { $ref: '#/components/schemas/BaseSchema' }
                        }
                    }
                },
                400: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorSchema" }
                        }
                    }
                }
            }
        },
        patch: {
            summary: "Update users",
            tags: ["User"],
            parameters: [
                {
                    name: "id",
                    in: "query",
                    description: "uuid of user",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema : {
                            type: "object", 
                            properties: {
                                username: { type: "string", required: false },
                                email: { type: "string", required: false },
                                role: { type: "string", required: false}
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "User updated",
                    content: {
                        "application/json" : {
                            schema: { $ref: "#/components/schemas/BaseResponse" }
                        }
                    }
                },
                400: {
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                }
            }
        },
        delete: {
            summary: "Delete user",
            tags: ["User"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "uuid of user",
                }
            ],
            responses: {
                200: {
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/BaseResponse" }
                        }
                    }
                },
                400: {
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                }
            }
        }
    },
    "/v1/user" : {
        get: {
            summary: "Fetch users",
            tags: ["User"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    description: "How many users to return",
                    required: false,
                    schema: { type: "integer", default: 10 }
                },
                {
                    name: "sort",
                    in: "query",
                    description: "Sorting order of data",
                    required: false,
                    schema: { type: "string", enum: ["asc", "desc"], default: "desc" }
                },
                {
                    name: "search",
                    in: "query",
                    description: "Search for data",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "lastId",
                    in: "query",
                    description: "cursor id",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "lastCreatedAt",
                    in: "query",
                    description: "cursor date",
                    required: false,
                    schema: { type: "date" }
                }
            ],
            responses: {
                200: {
                    description: "Users fetched",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/BaseResponse" }
                        }
                    }
                },
                400: {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" }
                        }
                    }
                }
            }
        }
    }
}

export { userPaths }