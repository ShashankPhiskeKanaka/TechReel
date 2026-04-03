interface Folder {
    id: string
    userId: string
    name: string
    createdAt: Date
}

interface FolderData {
    name: string
    userId: string
}

export type { Folder, FolderData }