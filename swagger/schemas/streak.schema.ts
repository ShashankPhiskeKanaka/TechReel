const StreakSchema = {
    Streak: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            currentStreak: { type: "integer" },
            longestStreak: { type: "integer" },
            createdAt: { type: "string", format: "date-time" }
        }
    }
}

export { StreakSchema }