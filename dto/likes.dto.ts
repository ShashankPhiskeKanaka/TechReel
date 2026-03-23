interface LikeData {
    user_id: string
    reel_id: string
}

interface Like { 
    id: string
    user_id: string
    reel_id: string
    created_at: Date
}

export type { Like, LikeData }