interface ViewData {
    userId: string
    reelId: string
    watchedSeconds: number
    completed: boolean
}

interface View {
    id: string
    user_id: string
    reel_id: string
    watched_seconds: number
    completed: boolean
    created_at: Date
}

export type { View, ViewData }