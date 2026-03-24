interface StreakData {
    userId: string
    currentStreak: number
    longestStreak: number
    lastActive: Date
}

interface Streak {
    id: string
    userId: string
    currentStreak: number
    longestStreak: number
    lastActive: Date
}

export type { Streak, StreakData }