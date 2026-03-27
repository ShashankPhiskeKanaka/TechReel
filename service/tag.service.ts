import { errorMessage } from "../constants/error.messages.js";
import { ServiceMessages } from "../constants/service.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { TagRepository } from "../repository/tag.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";
import type { Tag } from "../dto/tags.dto.js";

const serviceMessages = new ServiceMessages("Tag"); 

class TagService extends BaseService<Tag, any, any> {
    constructor ( methods : TagRepository ) {
        super(methods, "Tag");
    }

    // create = async (name: string) => {
    //     const tag = await this.TagMethods.create(name);

    //     logger.info(serviceMessages.CREATE.message, {
    //         tagId: tag.id
    //     });

    //     return tag;
    // }

    // fetch = async (id: string) => {
    //     const tag = await this.TagMethods.fetch(id);

    //     if(!tag.id) {
    //         logger.warn(serviceMessages.FETCH.error, {
    //             tagId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info(serviceMessages.FETCH.message, {
    //         tagId: tag.id
    //     });

    //     return tag;
    // }

    // fetchAll = async (data: PaginationData, filters: {}) => {
    //     const tags = await this.TagMethods.fetchAll(data, filters);

    //     if(tags.length == 0) {
    //         logger.warn(serviceMessages.FETCHALL.error);

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info(serviceMessages.FETCHALL.message);

    //     return tags;
    // }

    // delete = async (id: string) => {
    //     const tag = await this.TagMethods.delete(id);

    //     logger.info(serviceMessages.DELETE.hardDelete, {
    //         tagId: tag.id
    //     });

    //     return tag;
    // }
}

export { TagService };