interface ViewData {
    userId: string
    reelId: string
    watchedSeconds: number
    completed: boolean
}

interface View {
    id: string
    userId: string
    reelId: string
    watchedSeconds: number
    completed: boolean
    createdAt: Date
}

export type { View, ViewData }