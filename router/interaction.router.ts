import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { LikesRepository } from "../repository/likes.repository.js";
import { InteractionService } from "../service/interaction.service.js";
import { InteractionController } from "../controller/interaction.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(LikesRepository, InteractionService, InteractionController);

router.get("/like/:id", errorHandler.controllerWrapper(controller.fetchLikeCount));
router.use(authenticate);

router.post("/like/:id", errorHandler.controllerWrapper(controller.likeReel));
router.delete("/like/:id", errorHandler.controllerWrapper(controller.unlikeReel));
router.get("/like-status/:id", errorHandler.controllerWrapper(controller.fetchLikeRecord));


export { router as InteractionRouter };