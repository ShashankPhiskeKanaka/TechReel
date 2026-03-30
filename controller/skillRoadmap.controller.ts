import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { SkillService } from "../service/skill.service.js";
import { logger } from "../utils/logger.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { SkillRoadmapService } from "../service/skillRoadmap.service.js";

const controllerMessages = new ControllerMessages("Skill roadmap");

class SkillRoadmapController extends BaseController<SkillRoadmapService> {
    constructor(service: SkillRoadmapService) {
        super(service, "Skill roadmap");
    }

    /**
     * Handles the retrieval of all available skill roadmap records.
     * Supports pagination, category-specific filtering, and search functionality 
     * across name and category fields.
     * @param req - Express Request (query: page, limit, category)
     * @param res - Express Response (json: paginated roadmap records)
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const skillRoadmaps = await this.service.fetchAll(
            this.getPagination(req),
            {
                category: req.query.category?.toString()
            },
            [
                "name",
                "category"
            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, skillRoadmaps);
    }

}

export { SkillRoadmapController }