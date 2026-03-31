import type { Request, Response } from "express";
import type { SkillService } from "../service/skill.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { logger } from "../utils/logger.js";
import { ControllerMessages } from "../constants/controller.messages.js";
import { BaseController } from "./base.controller.js";

const controllerMessage = new ControllerMessages("Skill");

class SkillController extends BaseController<SkillService> {
    constructor(service: SkillService) {
        super(service, "Skill");
    }

    // create = async (req: Request, res: Response) => {

    //     logger.http(controllerMessage.CREATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id
    //     });

    //     const skill = await this.SkillService.create(req.body);

    //     return ApiResponse.success(res, controllerMessage.CREATE.res, skill);
    // }

    // fetch = async (req: Request, res: Response) => {

    //     logger.http(controllerMessage.FETCH.req, {
    //         ip: req.ip,
    //         skillId: req.params.id?.toString(),
    //         userId: req.user?.id
    //     });

    //     const skill = await this.SkillService.fetch(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessage.FETCH.res, skill);
    // }

    /**
     * Handles the retrieval of all available skill records with pagination and category filtering.
     * Searches across 'name' and 'category' fields using the repository search logic.
     * @param req - Express Request (query: page, limit, category)
     * @param res - Express Response (json: paginated skill records)
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessage.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id
        });

        const skills = await this.service.fetchAll(
            this.getPagination(req),
            {
                category: req.query.category?.toString()
            },
            [
                "name",
                "category"
            ]
        )

        return ApiResponse.success(res, controllerMessage.FETCHALL.res, skills);
    }

    // update = async (req: Request, res: Response) => {

    //     logger.http(controllerMessage.UPDATE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         skillId: req.body.id
    //     });

    //     const skill = await this.SkillService.update(req.body, req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessage.UPDATE.res, skill);
    // }

    // delete = async (req: Request, res: Response) => {

    //     logger.http(controllerMessage.DELETE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         skillId: req.body.id
    //     });

    //     const skill = await this.SkillService.delete(req.params.id?.toString() ?? "" , req.body.flag);

    //     return ApiResponse.success(res, controllerMessage.DELETE.res, skill);
    // }
}

export { SkillController };