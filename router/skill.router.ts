import express from "express";
import { SkillFactory } from "../factory/skill.factory.js";
import { SkillRepository } from "../repository/skill.repository.js";
import { SkillService } from "../service/skill.service.js";
import { SkillController } from "../controller/skill.controller.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { idempotencyMiddleware } from "../middleware/idempotency.middleware.js";
import { validate } from "../middleware/zod.middleware.js";
import { SkillsSchema, UpdateSkillData } from "../schema/skill.schema.js";
import { DeleteData, GetData } from "../schema/general.schema.js";
import { cacheMiddleware } from "../factory/cache.factory.js";

const router = express.Router();
const controller = SkillFactory.create(SkillRepository, SkillService, SkillController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PUBLIC"));

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.use(authenticateAdmin);
// router.use(idempotencyMiddleware);

router.post("/", errorHandler.controllerWrapper(validate(SkillsSchema)), errorHandler.controllerWrapper(controller.create));
router.patch("/", errorHandler.controllerWrapper(validate(UpdateSkillData)), errorHandler.controllerWrapper(controller.update));
router.delete("/:flag", errorHandler.controllerWrapper(validate(DeleteData)), errorHandler.controllerWrapper(controller.delete));

export { router as SkillRouter };