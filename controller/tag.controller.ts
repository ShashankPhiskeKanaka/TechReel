import type { Request, Response } from "express";
import type { TagService } from "../service/tag.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

class TagController {
    constructor ( private TagService : TagService ) {}

    create = async (req: Request, res: Response) => {
        logger.http("Tag creation request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const tag = await this.TagService.create(req.body.name);

        return ApiResponse.success(res, "Tag created", tag);
    }

    get = async (req: Request, res: Response) => {

        logger.http("Tag fetch request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });


        const tag = await this.TagService.get(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Tag fetched", tag);
    }

    delete = async (req: Request, res: Response) => {
        logger.http("Tag deletion request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });


        const tag = await this.TagService.delete(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Tag deleted", tag);
    }
}

export { TagController }