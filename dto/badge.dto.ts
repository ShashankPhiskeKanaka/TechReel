interface Badge {
    id: string
    skillId: string
    name: string
    description: string | null
    iconUrl: string | null
    xpReward: number
    createdAt: Date
    deletedAt: Date | null
}

interface BadgeData {
    skillId: string
    name: string
    description: string | null
    iconUrl: string | null
    xpReward: number
}

interface UserBadge {
    id: string
    userId: string
    badgeId: string
    createdAt: Date
}

interface UserBadgeData {
    userId: string
    badgeId: string
}

export type { Badge, BadgeData, UserBadge, UserBadgeData };