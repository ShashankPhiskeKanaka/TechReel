interface ReelSave {
    id: string
    userId: string
    reelId: string
    createdAt: Date
    folderId: string
}

interface ReelSaveData {
    userId: string
    reelId: string
    folderId: string
}

export type { ReelSave, ReelSaveData }