import { prisma } from "../db/prisma.js"
import type { Token, TokenData } from "../dto/token.dto.js"

class TokenRepository {
    create = async (data: TokenData): Promise<Token> => {
        const token = await prisma.tokens.create({
            data
        });

        return token;
    }

    update = async (data: TokenData, id: string): Promise<Token> => {
        const token = await prisma.tokens.update({
            where: {
                id: id,
                deleted_at: null
            },
            data: data
        });

        return token;
    }

    get = async (id: string) : Promise<Token> => {
        const token = await prisma.tokens.findUnique({
            where: {
                id: id,
                deleted_at : null
            }
        });

        return token ?? <Token>{};
    }

    softDelete = async (id: string) : Promise<Token> => {
        const token = await prisma.tokens.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            }
        });

        return token;
    }

    hardDelete = async (id: string): Promise<Token> => {
        const token = await prisma.tokens.delete({
            where: {
                id: id
            }
        });

        return token;
    }
}

export { TokenRepository }