import { prisma } from "../db/prisma.js"
import type { Xp, XpData } from "../dto/xp.dto.js"

class XpRepository {
    create = async (data: XpData): Promise<Xp> => {
        const xp = await prisma.xp_ledger.create({
            data: data
        });

        return xp;
    }

    fetch = async (id: string): Promise<Xp> => {
        const xp = await prisma.xp_ledger.findFirst({
            where:{
                id: id
            }
        });

        return xp ?? <Xp>{}
    }

    fetchByUser = async (userId: string): Promise<Xp[]> => {
        const allxp = await prisma.xp_ledger.findMany({
            where: {
                userId
            }
        });

        return allxp
    }

    delete = async (id: string): Promise<Xp> => {
        const xp = await prisma.xp_ledger.delete({
            where: {
                id: id
            }
        });

        return xp;
    }
}

export { XpRepository }