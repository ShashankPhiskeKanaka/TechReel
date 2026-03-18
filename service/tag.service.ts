import { errorMessage } from "../constants/error.messages.js";
import type { TagRepository } from "../repository/tag.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class TagService {
    constructor ( private TagMethods : TagRepository ) {}

    create = async (name: string) => {
        const tag = await this.TagMethods.create(name);

        logger.info("New tag created", {
            tagId: tag.id
        });

        return tag;
    }

    get = async (id: string) => {
        const tag = await this.TagMethods.get(id);

        if(!tag.id) {
            logger.warn("Tag fetch failed: No tag found with the id", {
                tagId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Tag fetched", {
            tagId: tag.id
        });

        return tag;
    }

    delete = async (id: string) => {
        const tag = await this.TagMethods.delete(id);

        logger.info("Tag deleted", {
            tagId: tag.id
        });

        return tag;
    }
}

export { TagService };