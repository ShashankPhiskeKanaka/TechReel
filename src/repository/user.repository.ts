import { errorMessage } from "../constants/error.messages.js";
import { prisma } from "../../db/prisma.js"
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import type { User, UserData, UserUpdateData } from "../dto/user.dto.js";
import type { UserProfile, UserProfileData } from "../dto/userProfile.dto.js";
import { Role } from "../../generated/prisma/enums.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { serverUtils } from "../utils/server.utils.js";

class UserRepository {

    /**
     * created a new user record in db and based on user role creates user profile record
     * 
     * @param data 
     * @returns 
     */
    create = async (data: UserData): Promise<User> => {
        return await prisma.$transaction(async (tx) => {
            const user = await tx.users.create({
                data: {
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    authProvider: "default",
                    role: Role.USER,
                    verified: false
                }
            });

            if (user.role == "USER") {
                await tx.user_profiles.create({
                    data: {
                        userId: user.id,
                        interests: {}
                    }
                });
            }

            return user;
        })
    }

    /**
     * fetches user based on username, performs soft delete check
     * 
     * @param username 
     * @returns 
     */
    fetchByUsername = async (username: string): Promise<User> => {
        const user = await prisma.users.findMany({
            where: {
                username: username,
                deletedAt: null
            }
        });

        return user[0] ?? <User>{};
    }

    fetchByEmail = async (email: string): Promise<User> => {
        const user = await prisma.users.findUnique({
            where: {
                email,
                deletedAt: null
            }
        });

        return user ?? <User>{};
    }

    /**
     * fetches user based on id, performs soft delete check and includes user profile when fetching data
     * 
     * @param id 
     * @returns 
     */
    fetch = async (id: string): Promise<User> => {
        const user = await prisma.users.findFirst({
            where: {
                id: id,
                deletedAt: null
            },
            include: {
                profile: true
            }
        });

        return user ?? <User>{};
    }

    /**
     * Retrieves a paginated list of active users with optional search and filtering.
     * Searches across both username and email using case-insensitive matching.
     * @param {PaginationData} data - Pagination settings, including limit, sort order, and search string.
     * @param {Object} filters - Additional criteria to filter the user results.
     * @returns {Promise<User[]>} A list of users matching the search and filter conditions.
     */
    fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]): Promise<User[]> => {

        let where: any = {
            deletedAt: null,
            AND: []
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);

        const users = await prisma.users.findMany({
            take: data.limit ?? PaginationConstants.limit,
            where,
            orderBy: [
                { createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' },
                { id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
            ]
        });

        return users;
    }

    /**
     * updates the verified field of the user, validates user existence
     * 
     * @param id 
     * @returns 
     */
    verified = async (id: string) => {
        return await prisma.$transaction(async (tx) => {
            const data = await tx.$queryRaw<any>`
                SELECT * FROM users
                WHERE ( id = ${id} ) AND ( deleted_at IS NULL )
                FOR UPDATE 
            `

            if (!data[0]) {
                logger.warn("No user found", {
                    userId: id
                });
                throw new serverError(errorMessage.NOTFOUND);
            }
            await tx.users.update({
                data: {
                    verified: true,
                },
                where: {
                    id: id
                }
            });

            return;
        })
    }

    update = async (data: UserUpdateData, id: string): Promise<User> => {
        const user = await prisma.users.update({
            where: {
                id,
                deletedAt: null
            },
            data
        });

        return user;
    }

    /**
     * Marks an user as deleted by setting a timestamp without removing the record.
     * 
     * @param {string} id - The unique ID of the user.
     * @returns {Promise<User>} The updated user record with the 'deletedAt' value.
     * @note Filters for 'deletedAt: null' to prevent re-deleting already inactive users.
     */
    softDelete = async (id: string): Promise<User> => {
        const user = await prisma.users.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        return user;
    }

    /**
     * Permanently removes an user record from the database.
     * 
     * @param {string} id - The unique ID of the user.
     * @returns {Promise<User>} The deleted user record metadata.
     * @throws {PrismaClientKnownRequestError} P2025 if the record does not exist.
     */
    hardDelete = async (id: string): Promise<User> => {
        const user = await prisma.users.delete({
            where: {
                id
            }
        });

        return user;
    }
}

export { UserRepository }