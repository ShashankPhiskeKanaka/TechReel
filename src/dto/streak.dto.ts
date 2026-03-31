interface StreakData {
    userId: string
    currentStreak: number
    longestStreak: number
}

interface Streak {
    id: string
    userId: string
    currentStreak: number
    longestStreak: number
    createdAt: Date
}

export type { Streak, StreakData }