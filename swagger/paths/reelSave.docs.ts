const reelSaveDocs = {
    "/v1/reel-save": {
        get: {
            summary: "Fetch Saved Reel Records",
            description: "Retrieves a paginated list of saved reels. Supports filtering by folder, reel, or user (Admin only).",
            tags: ["Saved Reels"],
            parameters: [
                {
                    name: "userId",
                    in: "query",
                    schema: { type: "string", format: "uuid" },
                    description: "Admin Only: Filter by a specific User ID"
                },
                {
                    name: "reelId",
                    in: "query",
                    schema: { type: "string", format: "uuid" },
                    description: "Filter to see if a specific reel is saved"
                },
                {
                    name: "folderId",
                    in: "query",
                    schema: { type: "string", format: "uuid" },
                    description: "Filter to see all reels within a specific folder"
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
                    description: "Saved reels retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/ReelSave" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: "Save Reel in Folder",
            tags: ["Saved Reels"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["reelId", "folderId"],
                            properties: {
                                reelId: { type: "string", format: "uuid" },
                                folderId: { type: "string", format: "uuid" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Reel saved successfully",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ReelSave" }
                        }
                    }
                }
            }
        }
    },
    "/v1/reel-save/{id}": {
        get: {
            summary: "Fetch Saved Reel Record by ID",
            tags: ["Saved Reels"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
            ],
            responses: {
                200: {
                    description: "Record found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ReelSave" }
                        }
                    }
                },
                404: { description: "Record not found" }
            }
        },
        delete: {
            summary: "Remove Saved Reel",
            description: "Deletes a saved reel record (unsaves the reel from a folder).",
            tags: ["Saved Reels"],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
            ],
            responses: {
                200: {
                    description: "Reel unsaved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Reel removed from folder" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export { reelSaveDocs };
