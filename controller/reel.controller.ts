import type { Request, Response } from "express";
import type { ReelService } from "../service/reel.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { z } from "zod";
import { status } from "../generated/prisma/enums.js";
import { logger } from "../utils/logger.js";

class ReelController {
    constructor ( private ReelService: ReelService ) {}

    create = async (req: Request, res: Response) => {

        logger.http("Reel upload request received", {
            creatorId: req.user?.id,
            ip: req.ip
        });

        const data = await this.ReelService.createPresignedUrl({
            ...req.body,
            creator_id: req.user?.id ?? ""
        });

        return ApiResponse.success(res, "Presigned url for reel upload generated", data);
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
        const reel = await this.ReelService.updateStatus(validatedStatus, reelId, req.body);

        return;
    }

    update = async (req: Request, res: Response) => {

        logger.http("Request to update reel metadata recieved", {
            ip: req.ip,
            creatorId: req.user?.id,
            reelId: req.params.id?.toString()
        });

        const reel = await this.ReelService.update(req.body, req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel updated", reel);
    }

    get = async (req: Request, res: Response) => {

        logger.http("Reel metadata fetch request received", {
            ip: req.ip,
            creatorId: req.user?.id,
            reelId: req.params.id?.toString()
        });

        const reel = await this.ReelService.get(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Reel fetched", reel);
    }

    delete = async (req: Request, res: Response) => {

        logger.http("Reel metadata delete request received", {
            ip: req.ip,
            creatorId: req.user?.id,
            reelId: req.body.id
        });

        const reel = await this.ReelService.delete(req.body.id, req.params.flag?.toString() == "true" ? true : false);

        return ApiResponse.success(res, "Reel deleted", reel);
    }
}

export { ReelController }