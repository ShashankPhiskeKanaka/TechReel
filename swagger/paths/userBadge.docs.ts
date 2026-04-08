const userBadgeDocs = {
    "/v1/user-badge": {
        get: {
            summary: "Fetch User Badges",
            description: "Retrieves a paginated list of badges assigned to users. Admins can filter by any userId; standard users see only their own.",
            tags: ["User Badges"],
            parameters: [
                {
                    name: "userId",
                    in: "query",
                    required: false,
                    schema: { type: "string", format: "uuid" },
                    description: "Admin Only: Filter badges for a specific user ID"
                },
                {
                    name: "badgeId",
                    in: "query",
                    required: false,
                    schema: { type: "string", format: "uuid" },
                    description: "Filter by a specific Badge ID"
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
                    description: "User badges retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/UserBadge" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/v1/user-badge/{id}": {
        get: {
            summary: "Fetch Specific User Badge",
            description: "Retrieves a single badge-to-user assignment record.",
            tags: ["User Badges"],
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
                    description: "Record found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: { $ref: "#/components/schemas/UserBadge" }
                                }
                            }
                        }
                    }
                },
                404: { description: "User badge record not found" }
            }
        }
    }
};

export { userBadgeDocs };
