interface PaginationData {
    limit?: number
    search?: string
    sort?: string
    lastCreatedAt?: Date
    lastId?: string
    filters?: {}
}

const PaginationConstants = {
    limit: 10,
    sort: 'desc' as 'asc' | 'desc'
}

export type { PaginationData }
export { PaginationConstants }