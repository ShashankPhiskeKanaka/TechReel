import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { SkillRoadmapRepository } from "../repository/skillRoadmap.repository.js";
import { SkillRoadmapService } from "../service/skillRoadmap.service.js";
import { SkillRoadmapController } from "../controller/skillRoadmap.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { DeleteData, GetData } from "../schema/general.schema.js";
import { CreateSkillRoadmap, UpdateSkillRoadmap } from "../schema/skillRoadmap.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(SkillRoadmapRepository, SkillRoadmapService, SkillRoadmapController);

router.use(authenticate);
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));

router.use(authenticateAdmin);
router.post("/", errorHandler.controllerWrapper(validate(CreateSkillRoadmap)), errorHandler.controllerWrapper(controller.create));
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateSkillRoadmap)), errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.delete));

export { router as SkillRoadmapRouter };