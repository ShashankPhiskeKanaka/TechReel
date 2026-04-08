const leaderboardDocs = {
    "/v1/leaderboard/:type": {
        get: {
            summary: "Fetch Leaderboard",
            description: "Retrieves the user leaderboard filtered by daily or monthly rankings.",
            tags: ["Leaderboard"],
            parameters: [
                {
                    name: "type",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        enum: ["daily", "monthly"],
                        example: "daily"
                    },
                    description: "The time-frame for the leaderboard rankings"
                }
            ],
            responses: {
                200: {
                    success: true,
                    message: "Leaderboard retrieved"
                    // Add data schema here if you want to show the user list
                },
                400: {
                    success: false,
                    message: "Invalid leaderboard type"
                }
            }
        }
    },
    "/v1/leaderboard": {
        get: {
            summary: "Leaderboard Live Updates (SSE)",
            description: "Establishes a Server-Sent Events (SSE) connection to receive real-time leaderboard updates. Note: This connection remains open.",
            tags: ["Leaderboard"],
            responses: {
                200: {
                    description: "SSE connection established",
                    headers: {
                        "Content-Type": {
                            schema: { type: "string", example: "text/event-stream" }
                        },
                        "Cache-Control": {
                            schema: { type: "string", example: "no-cache" }
                        },
                        "Connection": {
                            schema: { type: "string", example: "keep-alive" }
                        }
                    }
                }
            }
        }
    }
};

export { leaderboardDocs };
