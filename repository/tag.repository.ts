import { prisma } from "../db/prisma.js";
import type { Tag } from "../dto/tags.dto.js";

class TagRepository {
    create = async (name: string) : Promise<Tag> => {
        const tag = await prisma.tags.create({
            data: {
                name
            }
        });

        return tag;
    }

    get = async (id: string) : Promise<Tag> => {
        const tag = await prisma.tags.findUnique({
            where: {
                id
            }
        });

        return tag ?? <Tag> {};
    }

    delete = async (id: string) : Promise<Tag> => {
        const tag = await prisma.tags.delete({
            where: {
                id
            }
        });

        return tag;
    }
}

export { TagRepository };