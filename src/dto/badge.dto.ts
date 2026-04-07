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
    imageType?: string
}

interface BadgeUpdateData {
    skillId?: string
    name?: string
    description?: string
    iconUrl?: string
    xpReward?: number
    imageType?: string
}

interface UserBadge {
    id: string
    userId: string
    badgeId: string
    createdAt: Date
}

interface UserBadgeData {
    userId: string
    skillId: string
}

export type { Badge, BadgeData, UserBadge, UserBadgeData, BadgeUpdateData };