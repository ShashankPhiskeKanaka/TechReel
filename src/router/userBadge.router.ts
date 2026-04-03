import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { UserBadgesRepository } from "../repository/userBadge.repository.js";
import { UserBadgeService } from "../service/userBadge.service.js";
import { UserBadgeController } from "../controller/userBadge.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../zod.schema/general.schema.js";
import { cacheMiddleware } from "../factory/cache.factory.js";
import { config } from "../config/index.js";

const router = express.Router();
const controller = ControllerFactory.create(UserBadgesRepository, UserBadgeService, UserBadgeController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(config.ttlShort, "PRIVATE"));

router.get("/", errorHandler.controllerWrapper(controller.fetchAll));
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));

export { router as UserBadgeRouter };