import { errorMessage } from "../constants/error.messages.js";
import { prisma } from "../db/prisma.js"
import type { User } from "../dto/user.dto.js";
import { Role } from "../generated/prisma/enums.js";
import { serverError } from "../utils/error.utils.js";

class UserRepository {

    create = async (data: any) => {
        try {
            const user = await prisma.users.create({
                data: {
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    auth_provider: "default",
                    role: Role.USER,
                    verified: false
                }
            });

            return user;
        }catch (err: any) {
            throw new serverError({ status: err.status, message: err.message });
        }
    }

    getByUsername = async (username: string) => {
        const user = await prisma.users.findMany({
            where : {
                username: username,
                deleted_at: null
            }
        });

        return user[0] ?? <User>{};
    }

    getById = async (id: string) => {
        const user = await prisma.users.findMany({
            where: {
                id: id,
                deleted_at: null
            }
        });

        return user[0] ?? <User>{};
    }

    verified = async (id: string) => {
        return await prisma.$transaction(async (tx) => {
            const data = await tx.$queryRaw<any>`
                SELECT * FROM users
                WHERE ( id = ${id} ) AND ( deleted_at IS NULL )
                FOR UPDATE 
            `

            if(!data[0]) throw new serverError(errorMessage.NOTFOUND);

            await tx.users.update({
                data : {
                    verified: true,
                },
                where : {
                    id: id
                }
            });

            return;
        })
    }

}

export { UserRepository }