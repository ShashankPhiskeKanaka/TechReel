const userRoadmapStepDocs = {
    "/v1/user-roadmap-step": {
        get: {
            summary: "Fetch User Roadmap Steps",
            description: "Retrieves paginated progress steps. Admins can view any user's steps; standard users are restricted to their own.",
            tags: ["Roadmap"],
            parameters: [
                {
                    name: "roadmapStepId",
                    in: "query",
                    required: false,
                    schema: { type: "string", format: "uuid" },
                    description: "Filter by a specific Roadmap Step ID"
                },
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
                    description: "Search by step name"
                },
                {
                    name: "id",
                    in: "query",
                    schema: { type: "string" },
                    description: "Cursor ID for pagination"
                },
                {
                    name: "createdAt",
                    in: "query",
                    schema: { type: "string", format: "date-time" },
                    description: "Cursor Date for pagination"
                }
            ],
            responses: {
                200: {
                    description: "User roadmap steps retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/UserRoadmapStep" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/v1/user-roadmap-step/{id}": {
        get: {
            summary: "Fetch Specific User Roadmap Step",
            tags: ["Roadmap"],
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
                                    data: { $ref: "#/components/schemas/UserRoadmapStep" }
                                }
                            }
                        }
                    }
                },
                404: { description: "Step record not found" }
            }
        }
    }
};

export { userRoadmapStepDocs };
