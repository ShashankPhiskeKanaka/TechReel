import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { SkillService } from "../service/skill.service.js";
import { logger } from "../utils/logger.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { SkillRoadmapStepService } from "../service/skillRoadmapStep.service.js";

const controllerMessages = new ControllerMessages("Skill roadmap");

class SkillRoadmapStepController extends BaseController<SkillRoadmapStepService> {
    constructor(service: SkillRoadmapStepService) {
        super(service, "Skill roadmap");
    }

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

export { SkillRoadmapStepController }