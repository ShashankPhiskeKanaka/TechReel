interface UserCertificate {
    id: string
    skillId: string
    userId: string
    createdAt: Date
}

interface UserCertificateData {
    skillId: string
    userId: string
}

export type { UserCertificate, UserCertificateData }
