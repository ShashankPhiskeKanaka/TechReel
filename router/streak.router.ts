import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { StreakRepository } from "../repository/streak.repository.js";
import { StreakService } from "../service/streak.service.js";
import { StreakController } from "../controller/streak.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../schema/general.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(StreakRepository, StreakService, StreakController);

router.use(authenticate);

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.patch("/", errorHandler.controllerWrapper(controller.update));

router.post("/", errorHandler.controllerWrapper(controller.create));

export { router as StreakRouter };