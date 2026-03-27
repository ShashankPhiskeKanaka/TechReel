import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { UserRoadmapStepRepository } from "../repository/userRoadmapStep.repository.js";
import { UserRoadmapStepService } from "../service/userRoadmapStep.service.js";
import { UserRoadmapStepController } from "../controller/userRoadmapStep.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { cacheMiddleware } from "../factory/cache.factory.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../schema/general.schema.js";
import { CreateUserRoadmapStepData, UpdateUserRoadmapStepData } from "../schema/userRoadmapStep.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(UserRoadmapStepRepository, UserRoadmapStepService, UserRoadmapStepController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PRIVATE"));

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.use(authenticateAdmin);

router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateUserRoadmapStepData)), errorHandler.controllerWrapper(controller.update));
router.post("/", errorHandler.controllerWrapper(validate(CreateUserRoadmapStepData)), errorHandler.controllerWrapper(controller.create));
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.delete));

export { router as UserRoadmapStepRouter }