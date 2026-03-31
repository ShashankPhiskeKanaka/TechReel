import { errorMessage } from "../constants/error.messages.js";
import { prisma } from "../../db/prisma.js"
import type { RefreshToken } from "../dto/auth.dto.js";
import type { Role } from "../dto/user.dto.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class AuthRepository {

    /**
     * Persists a new refreshToken record in the db
     * 
     * @param familyId 
     * @param userId 
     * @returns {RefreshToken} data
     */
    create = async (familyId: string, userId: string, role: Role): Promise<RefreshToken> => {
        const data = await prisma.refresh_tokens.create({
            data: {
                familyId,
                userId,
                role
            }
        });

        logger.debug("DB: Refresh token record persisted", { userId, familyId })

        return data;
    }

    /**
     * Creates new refreshToken record, validates old refresh token, created record for same session by keeping familyId same
     * 
     * @param token 
     * @returns 
     */
    generateNewToken = async (token: string): Promise<RefreshToken> => {
        return await prisma.$transaction(async (tx) => {
            // 1. Fetch with Row Lock
            const rows = await tx.$queryRaw<any>`
                    SELECT 
                        id,
                        family_id AS "familyId",
                        user_id AS "userId",
                        is_used AS "isUsed",
                        role,
                        created_at AS "createdAt"
                    FROM refresh_tokens 
                    WHERE id = ${token}
                    FOR UPDATE
                `;

            const tokenData = rows[0];

            // 2. Immediate Guard
            if (!tokenData) {
                logger.warn("Token rotation failed: Token not found in DB", { tokenId: token });
                throw new serverError(errorMessage.UNAUTHORIZED);
            }

            // 3. Expiry Calculation (7 days)
            const expiryTime = new Date(tokenData.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
            const isExpired = Date.now() > expiryTime;
            // 4. Breach/Expiry Detection
            if (tokenData.isUsed || isExpired) {

                logger.warn(`Security Event: Refresh token ${tokenData.is_used ? "REUSE_DETECTED" : "TOKEN_EXPIRED"}`, {
                    userId: tokenData.userId,
                    familyId: tokenData.familyId,
                    reason: tokenData.isUsed ? "REUSE_DETECTED" : "TOKEN_EXPIRED"
                });

                const data = await tx.refresh_tokens.deleteMany({
                    where: { userId: tokenData.userId }
                });

                logger.info("Security Action: All user sessions invalidated", {
                    userId: tokenData.userId
                });
                return <RefreshToken>{};
            }

            // 5. Mark current token as used
            await tx.refresh_tokens.update({
                where: { id: token },
                data: { isUsed: true }
            });

            logger.debug("Token Rotation: Old token marked as used", {
                tokenId: token
            });
            console.log(tokenData);
            // 6. Create the replacement token in the same family
            const newToken = await tx.refresh_tokens.create({
                data: {
                    userId: tokenData.userId,
                    familyId: tokenData.familyId,
                    role: tokenData.role as Role
                }
            });

            logger.info("Token rotation successfull", {
                userId: tokenData.userId,
                familyId: tokenData.familyId
            });

            return newToken;
        });
    }


    /**
     * Deletes refreshToken records based on userId
     * 
     * @param userId 
     * @param refreshToken 
     * @returns 
     */
    deleteByUser = async (refreshToken: string): Promise<RefreshToken> => {
        return await prisma.$transaction(async (tx) => {
            const tokensData = await tx.$queryRaw<any>`
                    SELECT * FROM refresh_tokens
                    WHERE (id = ${refreshToken})
                    FOR UPDATE 
                `
            if (!tokensData[0]) {
                logger.warn("Token deletion failed: No token found with the id", {
                    tokenId: refreshToken,
                })
                throw new serverError(errorMessage.NOTFOUND);
            }
            await tx.refresh_tokens.deleteMany({
                where: {
                    userId: tokensData[0].userId
                }
            });
            if (tokensData[0].isUsed) {
                logger.warn(`Security Event: Refresh token ${tokensData[0].is_used ? "REUSE_DETECTED" : "TOKEN_EXPIRED"}`, {
                    userId: tokensData[0].userId,
                    familyId: tokensData[0].familyId,
                    reason: tokensData[0].isUsed ? "REUSE_DETECTED" : "TOKEN_EXPIRED"
                });
                throw new serverError(errorMessage.UNAUTHORIZED);
            }
            return tokensData[0];
        })
    }

    /**
     * Deletes refreshToken records based on familyId
     * 
     * @param refreshToken 
     * @returns 
     */
    deleteByFamily = async (refreshToken: string): Promise<RefreshToken> => {
        return await prisma.$transaction(async (tx) => {
            const tokensData = await tx.$queryRaw<any>`
                    SELECT * from refresh_tokens
                    WHERE id = ${refreshToken}
                    FOR UPDATE
                `
            if (!tokensData[0]) {
                logger.warn("Token deletion failed: No token found with the id", {
                    tokenId: refreshToken
                });
                throw new serverError(errorMessage.NOTFOUND);
            }
            if (tokensData[0].isUsed) {

                logger.warn(`Security Event: Refresh token ${tokensData[0].isUsed ? "REUSE_DETECTED" : "TOKEN_EXPIRED"}`, {
                    userId: tokensData[0].userId,
                    familyId: tokensData[0].familyId,
                    reason: tokensData[0].isUsed ? "REUSE_DETECTED" : "TOKEN_EXPIRED"
                });
                await tx.refresh_tokens.deleteMany({
                    where: {
                        userId: tokensData[0].userId
                    }
                })

                logger.info("Security Action: All user sessions invalidated", {
                    userId: tokensData[0].userId
                });
                throw new serverError(errorMessage.UNAUTHORIZED);
            }

            await tx.refresh_tokens.deleteMany({
                where: {
                    familyId: tokensData[0].familyId
                }
            });

            return tokensData[0];
        })
    }
}

export { AuthRepository }