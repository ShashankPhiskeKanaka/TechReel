interface StreakData {
    user_id: string
    current_streak: number
    longest_streak: number
    last_active: Date
}

interface Streak {
    id: string
    user_id: string
    current_streak: number
    longest_streak: number
    last_active: Date
}

export type { Streak, StreakData }