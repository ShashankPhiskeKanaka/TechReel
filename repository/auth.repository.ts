import { errorMessage } from "../constants/error.messages.js";
import { prisma } from "../db/prisma.js"
import type { RefreshToken } from "../dto/auth.dto.js";
import type { Role } from "../dto/user.dto.js";
import { serverError } from "../utils/error.utils.js";

class AuthRepository {

    /**
     * Persists a new refreshToken record in the db
     * 
     * @param familyId 
     * @param userId 
     * @returns {RefreshToken} data
     */
    create = async (familyId: string, userId: string, role: Role) : Promise<RefreshToken> => {
        const data = await prisma.refresh_tokens.create({
            data: {
                family_id: familyId,
                user_id: userId,
                role: role
            }
        });

        return data;
    }

    generateNewToken = async (token: string) => {
        return await prisma.$transaction(async (tx) => {
            try {
                // 1. Fetch with Row Lock
                const rows = await tx.$queryRaw<any>`
                    SELECT * FROM refresh_tokens 
                    WHERE id = ${token}
                    FOR UPDATE
                `;
                
                const tokenData = rows[0];

                // 2. Immediate Guard
                if (!tokenData) {
                    throw new serverError(errorMessage.UNAUTHORIZED);
                }

                // 3. Expiry Calculation (7 days)
                const expiryTime = new Date(tokenData.created_at).getTime() + 7 * 24 * 60 * 60 * 1000;
                const isExpired = Date.now() > expiryTime;
                // 4. Breach/Expiry Detection
                if (tokenData.is_used || isExpired) {
                    const data = await tx.refresh_tokens.deleteMany({
                        where: { user_id: tokenData.user_id }
                    });
                    return <RefreshToken>{};
                }

                // 5. Mark current token as used
                await tx.refresh_tokens.update({
                    where: { id: token },
                    data: { is_used: true }
                });

                // 6. Create the replacement token in the same family
                const newToken = await tx.refresh_tokens.create({
                    data: {
                        user_id: tokenData.user_id,
                        family_id: tokenData.family_id,
                        role: tokenData.role as Role
                    }
                });

                return newToken;

            } catch (err: any) {
                // Preserve the custom error status if it's already a serverError
                if (err instanceof serverError) throw err;
                throw new serverError({ status: 500, message: err.message });
            }
        });
    }


    /**
     * Deletes refreshToken records based on userId
     * 
     * @param userId 
     * @param refreshToken 
     * @returns 
     */
    deleteByUser = async (userId: string, refreshToken: string) => {
        return await prisma.$transaction(async (tx) => {
            try{
                const tokensData = await tx.$queryRaw<any>`
                    SELECT * FROM refresh_tokens
                    WHERE (id = ${refreshToken}) AND (user_id = ${userId})
                    FOR UPDATE 
                `
                if(!tokensData[0]) throw new serverError(errorMessage.NOTFOUND);
                await tx.refresh_tokens.deleteMany({
                    where : {
                        user_id: userId
                    }
                });
                if(tokensData[0].is_used) throw new serverError(errorMessage.UNAUTHORIZED);
                return;
            }
            catch (err : any) {
                throw new serverError({ status: err.status, message: err.message });
            }
        })
    }

    /**
     * Deletes refreshToken records based on familyId
     * 
     * @param refreshToken 
     * @returns 
     */
    deleteByFamily = async (refreshToken: string) => {
        return await prisma.$transaction(async (tx) => {
            try {
                const tokensData = await tx.$queryRaw<any>`
                    SELECT * from refresh_tokens
                    WHERE id = ${refreshToken}
                    FOR UPDATE
                `
                if(!tokensData[0]) throw new serverError(errorMessage.NOTFOUND);
                if(tokensData[0].is_used) {
                    await tx.refresh_tokens.deleteMany({
                        where : {
                            user_id : tokensData[0].user_id
                        }
                    })
                    throw new serverError(errorMessage.UNAUTHORIZED);
                }

                await tx.refresh_tokens.deleteMany({
                    where : {
                        family_id: tokensData[0].family_id
                    }
                });

                return;
                
            }catch (err: any) {
                throw new serverError({ status: err.status, message: err.message })
            }
        })
    }
}

export { AuthRepository }