import type { Request, Response } from "express";
import type { TokenService } from "../service/token.service.js";
import { logger } from "../utils/logger.js";

class TokenController {
    constructor(private TokenService: TokenService) {}

    create = async (req: Request, res: Response) => {
        logger.http("Token creation request received", {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const token = await this.TokenService.create(req.body);

        return res.json({
            success: true,
            message: "New token created",
            data: token
        });
    }

    get = async (req: Request, res: Response) => {
        logger.http("Token fetch request received", {
            ip: req.ip,
            userId: req.user?.id,
            tokenId: req.params.id?.toString() ?? "NA"
        });

        const token = await this.TokenService.get(req.params.id?.toString() ?? "");

        return res.json({
            success: true,
            message: "Token fetched",
            data: token
        });
    }

    update = async (req: Request, res: Response) => {

        logger.http("Token update request received", {
            ip: req.ip,
            userId: req.user?.id,
            tokenId: req.body.id
        });

        const token = await this.TokenService.update({ name: req.body?.name, token_url: req.body?.token_url }, req.body.id);

        return res.json({
            success: true,
            message: "Token updated",
            data: token
        });
    }

    delete = async (req: Request, res: Response) => {
        logger.http("Token delete request received", {
            ip: req.ip,
            userId: req.user?.id,
            tokenId: req.body.id
        });

        const token = await this.TokenService.delete(req.body.id, (req.params.flag?.toString() === "true" ? true : false));

        return res.json({
            success: true,
            message: "Token deleted",
            data: token
        });
    }
}

export { TokenController }