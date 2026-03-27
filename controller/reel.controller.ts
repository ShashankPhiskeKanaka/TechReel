import type { Request, Response } from "express";
import type { ReelService } from "../service/reel.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { z } from "zod";
import { status } from "../generated/prisma/enums.js";
import { logger } from "../utils/logger.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";

const controllerMessage = new ControllerMessages("Reel");

class ReelController extends BaseController<ReelService> {
    constructor ( service: ReelService ) {
        super(service, "Reel");
    }

    create = async (req: Request, res: Response) => {

        logger.http(controllerMessage.CREATE.req, {
            creatorId: req.user?.id,
            ip: req.ip
        });

        const data = await this.service.createPresignedUrl({
            ...req.body,
            creator_id: req.user?.id ?? ""
        });

        return ApiResponse.success(res, controllerMessage.CREATE.res, data);
    }

    updateStatus = async (req: Request, res: Response) => {

        logger.http("Updating reel metadata record request from aws received", {
            ip: req.ip,
            reelId: req.body.reelId
        });

        const updateStatusSchema = z.object({
            status: z.nativeEnum(status), // This ensures the string is "UPLOADED", "PENDING", etc.
            reelId: z.string()
        });

        const { status: validatedStatus, reelId } = updateStatusSchema.parse(req.body);
        await this.service.updateStatus(validatedStatus, reelId, req.body);

        return;
    }

    // update = async (req: Request, res: Response) => {

    //     logger.http(controllerMessage.UPDATE.req, {
    //         ip: req.ip,
    //         creatorId: req.user?.id,
    //         reelId: req.params.id?.toString()
    //     });

    //     const reel = await this.ReelService.update(req.body, req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessage.UPDATE.res, reel);
    // }

    // fetch = async (req: Request, res: Response) => {

    //     logger.http(controllerMessage.FETCH.req, {
    //         ip: req.ip,
    //         creatorId: req.user?.id,
    //         reelId: req.params.id?.toString()
    //     });

    //     const reel = await this.ReelService.fetch(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessage.FETCH.res, reel);
    // }

    fetchAll = async (req: Request, res: Response) => {

        logger.http(controllerMessage.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const reels = await this.service.fetchAll(
            this.getPagination(req),
            {
                creatorId: req.query.creatorId?.toString(),
                skillId: req.query.skillId?.toString(),
                difficultyLevel: req.query.difficultyLevel?.toString(),
            },
            [
                "title"
            ]
        )

        return ApiResponse.success(res, controllerMessage.FETCHALL.res, reels);
    }

    // delete = async (req: Request, res: Response) => {

    //     logger.http(controllerMessage.DELETE.req, {
    //         ip: req.ip,
    //         creatorId: req.user?.id,
    //         reelId: req.body.id
    //     });

    //     const reel = await this.ReelService.delete(req.body.flag, req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessage.DELETE.res, reel);
    // }
}

export { ReelController }