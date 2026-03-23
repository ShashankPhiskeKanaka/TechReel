import type { Request, Response } from "express";
import type { SkillService } from "../service/skills.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { logger } from "../utils/logger.js";

class SkillController {
    constructor (private SkillService : SkillService) {}

    create = async (req: Request, res: Response) => {

        logger.http("New skill create request received", {
            ip: req.ip,
            userId: req.user?.id
        });

        const skill = await this.SkillService.create(req.body);

        return ApiResponse.success(res, "New skill created", skill);
    }

    get = async (req: Request, res: Response) => {

        logger.http("Skill fetch request received", {
            ip: req.ip,
            skillId: req.params.id?.toString(),
            userId: req.user?.id
        });

        const skill = await this.SkillService.get(req.params.id?.toString() ?? "");

        return ApiResponse.success(res, "Skill fetched", skill);
    }

    update = async (req: Request, res: Response) => {

        logger.http("Skill update request received", {
            ip: req.ip,
            userId: req.user?.id,
            skillId: req.body.id
        });

        const skill = await this.SkillService.update({ name: req.body.name, category: req.body.category, description: req.body.description }, req.body.id);

        return ApiResponse.success(res, "Skill updated", skill);
    }

    delete = async (req: Request, res: Response) => {

        logger.http("Skill delete request received", {
            ip: req.ip,
            userId: req.user?.id,
            skillId: req.body.id
        });

        const skill = await this.SkillService.delete(req.body.id, req.params.flag?.toString() === "true" ? true : false);

        return ApiResponse.success(res, "Skill deleted", skill);
    }
}

export { SkillController };