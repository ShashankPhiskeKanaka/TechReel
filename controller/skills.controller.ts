import type { Request, Response } from "express";
import type { SkillService } from "../service/skills.service.js";

class SkillController {
    constructor (private SkillService : SkillService) {}

    create = async (req: Request, res: Response) => {
        const skill = await this.SkillService.create(req.body);

        return res.json({
            success: true,
            message: "New skill created",
            data: skill
        });
    }

    get = async (req: Request, res: Response) => {
        const skill = await this.SkillService.get(req.params.id?.toString() ?? "");

        return res.json({
            success: true,
            message: "Skill fetched",
            data: skill
        });
    }

    update = async (req: Request, res: Response) => {
        const skill = await this.SkillService.update({ name: req.body.name, category: req.body.category, description: req.body.description }, req.body.id);

        return res.json({
            success: true,
            message: "Skill updated",
            data: skill
        });
    }

    delete = async (req: Request, res: Response) => {
        const skill = await this.SkillService.delete(req.body.id, req.params.flag?.toString() === "true" ? true : false);

        return res.json({
            success: true,
            message: "Skill deleted",
            data: skill
        });
    }
}

export { SkillController };