// controllers/base.controller.ts
import type { Request, Response } from "express";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";

export abstract class BaseController<TService> {
    protected messages: ControllerMessages;

    constructor(
        protected service: TService,
        protected modelName: string
    ) {
        this.messages = new ControllerMessages(modelName);
    }

    /**
     * Helper to log HTTP requests consistently
     */
    protected logRequest(req: Request, message: string, extra = {}) {
        logger.http(message, {
            ip: req.ip,
            userId: req.user?.id ?? "PUBLIC",
            ...extra
        });
    }

    /**
     * Helper to extract common pagination data
     */
    protected getPagination(req: Request) {
        return {
            limit: Number(req.query.limit) || undefined,
            sort: req.query.sort?.toString(),
            search: req.query.search?.toString() ?? "",
            lastId: req.query.id?.toString() ?? "",
            lastCreatedAt: req.query.createdAt ? new Date(req.query.createdAt.toString()) : undefined,
        };
    }

    create = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.CREATE.req);
        // @ts-ignore
        const result = await this.service.create(req.body);
        return ApiResponse.success(res, this.messages.CREATE.res, result);
    }

    fetch = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.FETCH.req, { id });
        // @ts-ignore
        const result = await this.service.fetch(id);
        return ApiResponse.success(res, this.messages.FETCH.res, result);
    }

    update = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.UPDATE.req, { id });
        // @ts-ignore
        const result = await this.service.update(req.body, id);
        return ApiResponse.success(res, this.messages.UPDATE.res, result);
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.DELETE.req, { id });
        // @ts-ignore
        const result = await this.service.delete(id, req.body?.flag ? req.body.flag : true);
        return ApiResponse.success(res, this.messages.DELETE.res, result);
    }
}
