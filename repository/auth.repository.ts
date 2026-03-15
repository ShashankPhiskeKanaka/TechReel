import { prisma } from "../db/prisma.js"
import type { RefreshToken } from "../dto/refreshToken.dto.js"

class AuthRepository {
    create = async (familyId: string, userId: string) : Promise<RefreshToken> => {
        const data = await prisma.refresh_tokens.create({
            data: {
                family_id: familyId,
                user_id: userId
            }
        });

        return data;
    }
}

export { AuthRepository }