import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { ReelRespository } from "../repository/reel.repository.js";
import { ReelService } from "../service/reel.service.js";
import { ReelController } from "../controller/reel.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { DeleteData, GetData } from "../schema/general.schema.js";
import { ReelSchema, UpdateReelSchema } from "../schema/reel.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(ReelRespository, ReelService, ReelController);

router.patch("/status", errorHandler.controllerWrapper(controller.updateStatus));

router.use(authenticate);
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.get));

router.use(authenticateAdmin);
router.post("/", errorHandler.controllerWrapper(validate(ReelSchema)), errorHandler.controllerWrapper(controller.create));
router.patch("/", errorHandler.controllerWrapper(validate(UpdateReelSchema)), errorHandler.controllerWrapper(controller.update));
router.delete("/:flag", errorHandler.controllerWrapper(validate(DeleteData)), errorHandler.controllerWrapper(controller.delete));

export { router as ReelRouter };