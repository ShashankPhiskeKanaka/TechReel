import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { ReelSaveRepsitory } from "../repository/reelSave.repository.js";
import { ReelSaveService } from "../service/reelSave.service.js";
import { ReelSaveController } from "../controller/reelSave.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../zod.schema/general.schema.js";
import { CreateReelSave } from "../zod.schema/reelSave.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(ReelSaveRepsitory, ReelSaveService, ReelSaveController);

router.use(authenticate);

router.post("/", errorHandler.controllerWrapper(validate(CreateReelSave)), errorHandler.controllerWrapper(controller.create));

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.delete));

export { router as ReelSaveRouter };