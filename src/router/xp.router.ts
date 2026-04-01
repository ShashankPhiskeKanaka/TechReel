import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { XpRepository } from "../repository/xp.repository.js";
import { XpService } from "../service/xp.service.js";
import { XpController } from "../controller/xp.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";


const router = express.Router();
const controller = ControllerFactory.create(XpRepository, XpService, XpController);

router.use(authenticate);

router.get("/:id", errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

export { router as XpRouter };