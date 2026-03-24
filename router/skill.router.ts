import express from "express";
import { SkillFactory } from "../factory/skill.factory.js";
import { SkillRepository } from "../repository/skill.repository.js";
import { SkillService } from "../service/skill.service.js";
import { SkillController } from "../controller/skill.controller.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { idempotencyMiddleware } from "../middleware/idempotency.middleware.js";
import { validate } from "../middleware/zod.middleware.js";
import { SkillsSchema } from "../schema/skills.schema.js";
import { DeleteData, GetData } from "../schema/general.schema.js";

const router = express.Router();
const controller = SkillFactory.create(SkillRepository, SkillService, SkillController);

router.use(authenticateAdmin);
// router.use(idempotencyMiddleware);

router.post("/", errorHandler.controllerWrapper(validate(SkillsSchema)), errorHandler.controllerWrapper(controller.create));
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.get));
router.patch("/", errorHandler.controllerWrapper(validate(SkillsSchema)), errorHandler.controllerWrapper(controller.update));
router.delete("/:flag", errorHandler.controllerWrapper(validate(DeleteData)), errorHandler.controllerWrapper(controller.delete));

export { router as SkillRouter };