import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { LikeRepository } from "../repository/like.repository.js";
import { InteractionService } from "../service/interaction.service.js";
import { InteractionController } from "../controller/interaction.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../schema/general.schema.js";
import { InteractionFactory } from "../factory/interaction.factory.js";
import { ViewRepository } from "../repository/view.repository.js";
import { CreateViewRecord, DeleteViewRecord } from "../schema/interaction.schema.js";

const router = express.Router();
const controller = InteractionFactory.create(LikeRepository, ViewRepository, InteractionService, InteractionController);

router.get("/like/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetchLikeCount));
router.get("/view/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetchViews));
router.use(authenticate);

router.post("/like/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.likeReel));
router.delete("/like/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.unlikeReel));
router.get("/like-status/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetchLikeRecord));

router.post("/view", errorHandler.controllerWrapper(validate(CreateViewRecord)), errorHandler.controllerWrapper(controller.createViewRecord));
router.get("/view-record/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetchViewRecord));
router.get("/view-reel/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetchViewRecordsByReel));
router.get("/view-user", errorHandler.controllerWrapper(controller.fetchViewRecordsByUser));

router.use(authenticateAdmin);
router.delete("/view", errorHandler.controllerWrapper(validate(DeleteViewRecord)), errorHandler.controllerWrapper(controller.deleteView))


export { router as InteractionRouter };