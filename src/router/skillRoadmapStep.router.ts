import express from "express";
import { ControllerFactory } from "../../factory/general.factory.js";
import { SkillRoadmapStepRepository } from "../repository/skillRoadmapStep.repository.js";
import { SkillRoadmapStepService } from "../service/skillRoadmapStep.service.js";
import { SkillRoadmapStepController } from "../controller/skillRoadmapStep.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../../factory/auth.factory.js";
import { GetData } from "../../schema/general.schema.js";
import { validate } from "../middleware/zod.middleware.js";
import { CreateSkillRoadmapSteps, UpdateSkillRoadmapSteps } from "../../schema/skillRoadmapStep.schema.js";
import { cacheMiddleware } from "../../factory/cache.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(SkillRoadmapStepRepository, SkillRoadmapStepService, SkillRoadmapStepController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PUBLIC"));

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.use(authenticateAdmin);
router.post("/", errorHandler.controllerWrapper(validate(CreateSkillRoadmapSteps)), errorHandler.controllerWrapper(controller.create));
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateSkillRoadmapSteps)), errorHandler.controllerWrapper(controller.update));

export { router as SkillRoadmapStepRouter };