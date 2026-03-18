import type { Request, Response } from "express";
import type { TagService } from "../service/tag.service.js";
import { logger } from "../utils/logger.js";

class TagController {
    constructor ( private TagService : TagService ) {}

    create = async (req: Request, res: Response) => {
        logger.http("Tag creation request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const tag = await this.TagService.create(req.body.name);

        return res.json({
            success: true,
            message: "New tag created",
            data: tag
        });
    }

    get = async (req: Request, res: Response) => {

        logger.http("Tag fetch request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });


        const tag = await this.TagService.get(req.params.id?.toString() ?? "");

        return res.json({
            success: true,
            message: "Tag fetched",
            data: tag
        });
    }

    delete = async (req: Request, res: Response) => {
        logger.http("Tag deletion request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });


        const tag = await this.TagService.delete(req.params.id?.toString() ?? "");

        return res.json({
            success: true,
            message: "Tag deleted",
            data: tag
        });
    }
}

export { TagController }