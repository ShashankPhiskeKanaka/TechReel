import { prisma } from "../db/prisma.js";
import type { UserToken, UserTokenData } from "../dto/token.dto.js";

class UserTokenRepository {
    create = async (data: UserTokenData): Promise<UserToken> => {
        const userTokenBalance = await prisma.user_token_balance.create({
            data: data
        });

        return userTokenBalance;
    }

    fetch = async (id: string): Promise<UserToken> => {
        const userTokenBalance = await prisma.user_token_balance.findFirst({
            where: {
                id: id
            }
        });

        return userTokenBalance ?? <UserToken> {};
    }

    fetchByUser = async (userId: string): Promise<UserToken> => {
        const userTokenBalance = await prisma.user_token_balance.findFirst({
            where: {
                user_id: userId
            }
        });

        return userTokenBalance ?? <UserToken>{};
    }

    delete = async (id: string): Promise<UserToken> => {
        const userTokenBalance = await prisma.user_token_balance.delete({
            where: {
                id
            }
        });

        return userTokenBalance;
    }
}

export { UserTokenRepository };