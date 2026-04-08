const folderDocs = {
    "/v1/folder": {
        get: {
            summary: "Fetch Folders",
            description: "Retrieves a paginated list of folders. Admins can view any user's folders; standard users see only their own.",
            tags: ["Folders"],
            parameters: [
                {
                    name: "userId",
                    in: "query",
                    required: false,
                    schema: { type: "string", format: "uuid" },
                    description: "Admin Only: Filter by a specific User ID"
                },
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", default: 10 }
                },
                {
                    name: "sort",
                    in: "query",
                    schema: { type: "string", enum: ["asc", "desc"] }
                },
                {
                    name: "search",
                    in: "query",
                    schema: { type: "string" },
                    description: "Search by folder name"
                },
                {
                    name: "id",
                    in: "query",
                    description: "Cursor ID for pagination",
                    schema: { type: "string" }
                },
                {
                    name: "createdAt",
                    in: "query",
                    description: "Cursor Date for pagination",
                    schema: { type: "string", format: "date-time" }
                }
            ],
            responses: {
                200: {
                    description: "Folders retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Folder" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: "Create Folder",
            tags: ["Folders"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name"],
                            properties: {
                                name: { type: "string", example: "New Folder Name" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Folder created successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Folder" }
                        }
                    }
                }
            }
        }
    },
    "/v1/folder/{id}": {
        get: {
            summary: "Fetch Folder by ID",
            tags: ["Folders"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
            ],
            responses: {
                200: {
                    description: "Folder found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Folder" }
                        }
                    }
                },
                404: { description: "Folder not found" }
            }
        },
        patch: {
            summary: "Update Folder",
            tags: ["Folders"],
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
                                name: { type: "string", example: "Updated Folder Name" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Folder updated",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Folder" }
                        }
                    }
                }
            }
        },
        delete: {
            summary: "Delete Folder",
            tags: ["Folders"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
            ],
            responses: {
                200: {
                    description: "Folder deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Folder removed" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export { folderDocs };
