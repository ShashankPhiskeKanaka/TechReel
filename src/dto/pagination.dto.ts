interface PaginationData {
    limit: number | undefined
    search: string | undefined
    sort: string | undefined
    lastCreatedAt: Date | undefined
    lastId: string | undefined
}

const PaginationConstants = {
    limit: 10,
    sort: 'desc' as 'asc' | 'desc'
}

export type { PaginationData }
export { PaginationConstants }