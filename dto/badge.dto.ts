interface Badge {
    id: string
    skill_id: string
    name: string
    description: string | null
    icon_url: string | null
    xp_reward: number
    created_at: Date
    deleted_at: Date | null
}

interface BadgeData {
    skill_id: string
    name: string
    description: string | null
    icon_url: string | null
    xp_reward: number
}

interface UserBadge {
    id: string
    user_id: string
    badge_id: string
    created_at: Date
}

interface UserBadgeData {
    user_id: string
    badge_id: string
}

export type { Badge, BadgeData, UserBadge, UserBadgeData };