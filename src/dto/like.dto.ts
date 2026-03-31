interface LikeData {
    userId: string
    reelId: string
}

interface Like { 
    id: string
    userId: string
    reelId: string
    createdAt: Date
}

export type { Like, LikeData }