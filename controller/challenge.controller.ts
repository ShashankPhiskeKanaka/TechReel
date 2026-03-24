import type { Request, Response } from "express";
import type { ChallengeService } from "../service/challenge.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

class ChallengeController {
    constructor ( private ChallengeService: ChallengeService ) {}

    create = async (req: Request, res: Response) => {
        logger.http("Challenge creation request received", {
            ip: req.ip,
            userId: req.user?.id
        });

        const challenge = await this.ChallengeService.create(req.body);

        return ApiResponse.success(res, "Challenge created", challenge);
    }

    fetch = async (req: Request, res: Response) => {

        logger.http("Fetch challenge request recieved", {
            ip: req.ip,
            userId: req.user?.id ?? "PUBLIC",
            challengeId: req.params.id?.toString()
        });

        const challenge = await this.ChallengeService.fetch(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge fetched", challenge);
    }

    fetchByReel = async (req: Request, res: Response) => {
        logger.http("Fetch challenge by reel request received", {
            ip: req.ip,
            userId: req.user?.id,
            reelId: req.params.id?.toString()
        });

        const challenge = await this.ChallengeService.fetchByReel(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge fetched by reelId", challenge);
    }

    update = async (req: Request, res: Response) => {
        logger.http("Challenge update request received", {
            ip: req.ip,
            userId: req.user?.id,
            challengeId: req.params.id?.toString()
        });

        const challenge = await this.ChallengeService.update(req.body, req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge updated", challenge);
    }

    delete = async (req: Request, res: Response) => {
        logger.http("Challenge delete request received", {
            ip: req.ip,
            userId: req.user?.id,
            challengeId: req.params.id?.toString()
        });

        const challenge = await this.ChallengeService.delete(req.body.flag, req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Challenge deleted", challenge);
    }
}

export { ChallengeController }