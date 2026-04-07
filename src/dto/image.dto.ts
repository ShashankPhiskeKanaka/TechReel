type ResourceType = "USER" | "TOKEN";

interface Image {
    id: string
    url?: string
    key?: string
    imageType: string
    resourceType: ResourceType
    resourceId: string
    createdAt: Date
}

interface ImageData {
    resourceType: ResourceType
    resourceId: string
    imageType: string
}

export type { Image, ImageData, ResourceType };