import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { BadgeRepository } from "../repository/badge.repository.js";
import { BadgeService } from "../service/badge.service.js";
import { BadgeController } from "../controller/badge.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { DeleteData, GetData } from "../schema/general.schema.js";
import { CreateBadge, UpdateBadge } from "../schema/badge.schema.js";
import { cacheMiddleware } from "../factory/cache.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(BadgeRepository, BadgeService, BadgeController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PUBLIC"));

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.use(authenticateAdmin);
router.post("/", errorHandler.controllerWrapper(validate(CreateBadge)), errorHandler.controllerWrapper(controller.create));
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateBadge)), errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(validate(DeleteData)), errorHandler.controllerWrapper(controller.delete));

export { router as BadgeRouter };