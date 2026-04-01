// controllers/base.controller.ts
import type { Request, Response } from "express";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { ControllerMessages } from "../constants/controller.messages.js";

/**
 * Abstract Base Controller providing standardised HTTP request handlers.
 * Orchestrates the flow between Express request/response objects and the Service layer.
 * 
 * @template TService - The service instance type used for business logic.
 */
export abstract class BaseController<TService> {
    protected messages: ControllerMessages;

    constructor(
        protected service: TService,
        protected modelName: string
    ) {
        this.messages = new ControllerMessages(modelName);
    }

    /**
     * Helper to log HTTP requests with consistent metadata.
     * Captures IP, User ID (if authenticated), and additional context for audit trails.
     * 
     * @param req - The Express request object.
     * @param message - The descriptive log message.
     * @param extra - Optional additional metadata to include in the log.
     * @protected
     */
    protected logRequest(req: Request, message: string, extra = {}) {
        logger.http(message, {
            ip: req.ip,
            userId: req.user?.id ?? "PUBLIC",
            ...extra
        });
    }

    /**
     * Extracts and normalises pagination, sorting, and cursor parameters from the request query.
     * Supports cursor-based navigation using ID and creation timestamps.
     * 
     * @param req - The Express request object containing query parameters.
     * @returns Normalized pagination metadata for service-layer consumption.
     * @protected
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

    /**
     * Standardised handler for creating a new resource.
     * Expects payload in `req.body`.
     * 
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns {Promise<Response>} 201 Created with the resulting data.
     */
    create = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.CREATE.req);
        // @ts-ignore
        const result = await this.service.create(req.body);
        return ApiResponse.success(res, this.messages.CREATE.res, result);
    }

    /**
     * Standardised handler for retrieving a single resource by ID.
     * Expects `id` in `req.params`.
     * 
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns {Promise<Response>} 200 OK with the retrieved record.
     */
    fetch = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.FETCH.req, { id });
        // @ts-ignore
        const result = await this.service.fetch(id, req.user?.role == "ADMIN" ? undefined : req.user?.id);
        return ApiResponse.success(res, this.messages.FETCH.res, result);
    }

    /**
     * Standardised handler for updating an existing resource.
     * Expects `id` in `req.params` and update payload in `req.body`.
     * 
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns {Promise<Response>} 200 OK with the updated record.
     */
    update = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.UPDATE.req, { id });
        // @ts-ignore
        const result = await this.service.update(req.body, id, req.user?.role == "ADMIN" ? undefined : req.user?.id);
        return ApiResponse.success(res, this.messages.UPDATE.res, result);
    }

    /**
     * Standardised handler for resource deletion (Soft or Hard).
     * Expects `id` in `req.params` and an optional `flag` in `req.body`.
     * 
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns {Promise<Response>} 200 OK confirming the deletion.
     */
    delete = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.DELETE.req, { id });
        // @ts-ignore
        const result = await this.service.delete(id, req.body?.flag ? req.body.flag : true, req.user?.role == "ADMIN" ? undefined : req.user?.id);
        return ApiResponse.success(res, this.messages.DELETE.res, result);
    }
}
