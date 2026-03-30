import type { Request, Response } from "express";
import type { TokenService } from "../service/token.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { BaseController } from "./base.controller.js";
import { ControllerMessages } from "../constants/controller.messages.js";

const controllerMessages = new ControllerMessages("Token");

class TokenController extends BaseController<TokenService>  {
    constructor(service: TokenService) {
        super(service, "Token");
    }

    /**
     * Handles the retrieval of all token-related records (e.g., token definitions or ledger entries).
     * Implements pagination and supports searching across the 'name' field.
     * @param req - Express Request (query: page, limit, search)
     * @param res - Express Response (json: paginated token records)
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const tokens = await this.service.fetchAll(
            this.getPagination(req),
            {
            },
            [
                "name"
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, tokens);
    }
    // create = async (req: Request, res: Response) => {
    //     logger.http("Token creation request received", {
    //         ip: req.ip,
    //         userId: req.user?.id ?? "NA"
    //     });

    //     const token = await this.TokenService.create(req.body);

    //     return ApiResponse.success(res, "New token created", token);
    // }

    // get = async (req: Request, res: Response) => {
    //     logger.http("Token fetch request received", {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         tokenId: req.params.id?.toString() ?? "NA"
    //     });

    //     const token = await this.TokenService.get(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, "Token fetched", token);
    // }

    // update = async (req: Request, res: Response) => {

    //     logger.http("Token update request received", {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         tokenId: req.body.id
    //     });

    //     const token = await this.TokenService.update({ name: req.body?.name, token_url: req.body?.token_url }, req.body.id);

    //     return ApiResponse.success(res, "Token updated", token);
    // }

    // delete = async (req: Request, res: Response) => {
    //     logger.http("Token delete request received", {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         tokenId: req.body.id
    //     });

    //     const token = await this.TokenService.delete(req.body.id, (req.params.flag?.toString() === "true" ? true : false));

    //     return ApiResponse.success(res, "Token deleted", token);
    // }
}

export { TokenController }