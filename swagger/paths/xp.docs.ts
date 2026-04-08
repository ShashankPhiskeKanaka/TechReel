const xpDocs = {
    "/v1/xp": {
        get: {
            summary: "Fetch XP Ledgers",
            description: "Retrieves a list of XP transactions with cursor-based pagination.",
            tags: ["XP"],
            parameters: [
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", default: 10 }
                },
                {
                    name: "sort",
                    in: "query",
                    schema: { type: "string", enum: ["asc", "desc"], default: "desc" }
                },
                {
                    name: "search",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "id",
                    in: "query",
                    description: "Cursor: The ID of the last record from the previous page",
                    schema: { type: "string" }
                },
                {
                    name: "createdAt",
                    in: "query",
                    description: "Cursor: The timestamp of the last record from the previous page",
                    schema: { type: "string", format: "date-time" }
                }
            ],
            responses: {
                200: {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Xp" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/v1/xp/{id}": {
        get: {
            summary: "Fetch XP Ledger by ID",
            tags: ["XP"],
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
                    description: "XP ledger entry found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: { $ref: "#/components/schemas/Xp" }
                                }
                            }
                        }
                    }
                },
                404: { description: "Entry not found" }
            }
        }
    }
};

export { xpDocs };
