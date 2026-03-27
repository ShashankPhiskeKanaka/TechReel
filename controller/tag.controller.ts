import type { Request, Response } from "express";
import type { TagService } from "../service/tag.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";
import type { Tag } from "../dto/tags.dto.js";

const controllerMessages = new ControllerMessages("Tag");

class TagController extends BaseController<TagService> {
    constructor ( service : TagService ) {
        super(service, "Tag");
    }

    // create = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.CREATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA"
    //     });

    //     const tag = await this.TagService.create(req.body.name);

    //     return ApiResponse.success(res, controllerMessages.CREATE.res, tag);
    // }

    // fetch = async (req: Request, res: Response) => {

    //     logger.http(controllerMessages.FETCH.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA"
    //     });


    //     const tag = await this.TagService.fetch(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.FETCH.res, tag);
    // }

    // delete = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.DELETE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA"
    //     });


    //     const tag = await this.TagService.delete(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.DELETE.res, tag);
    // }
}

export { TagController }