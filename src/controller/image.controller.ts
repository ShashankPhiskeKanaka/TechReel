import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { ImageService } from "../service/image.service.js";
import { BaseController } from "./base.controller.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("IMAGE");

class ImageController extends BaseController<ImageService> {
    constructor(service: ImageService) {
        super(service, "IMAGE");
    }

    awsCallback = async (req: Request, res: Response) => {
        logger.http("Callback from AWS received", {
            ip: req.ip
        });

        await this.service.update( { url: req.body.url, key: req.body.fileKey } , req.body.imageId);

        return ApiResponse.success(res, "Image record updated");
    }
}

export { ImageController };