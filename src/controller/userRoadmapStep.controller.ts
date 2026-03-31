import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { UserRoadmapStepService } from "../service/userRoadmapStep.service.js";
import { logger } from "../utils/logger.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("User roadmap steps");

class UserRoadmapStepController extends BaseController<UserRoadmapStepService> {

    constructor(service: UserRoadmapStepService) {
        super(service, "User roadmap step");
    }

    /**
     * Retrieves a paginated list of user roadmap steps.
     * Supports search functionality across 'name' and 'bio' fields.
     * @param req - Express Request (query: page, limit, search)
     * @param res - Express Response (json: paginated profiles)
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const userProfiles = await this.service.fetchAll(
            this.getPagination(req),
            {
                roadmapStepId: req.query.roadmapStepId?.toString(),
                userId: req.user?.role == "ADMIN" ? req.query.userId?.toString() : req.user?.id
            },
            [
                "name"
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, userProfiles);
    }
}

export { UserRoadmapStepController }