interface ViewsData {
    userId: string
    reelId: string
    watchedSeconds: Number
    completed: Boolean
}

interface Views {
    id: string
    user_id: string
    reel_id: string
    watched_seconds: Number
    completed: Boolean
    created_at: Date
}

export type { Views, ViewsData }