import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { FeedRepository } from "../repository/feed.repository.js";
import { FeedService } from "../service/feed.service.js";
import { FeedController } from "../controller/feed.controller.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = express.Router();
const controller = ControllerFactory.create(FeedRepository, FeedService, FeedController);

router.use(authenticate)

router.get("/", errorHandler.controllerWrapper(controller.fetch));

export { router as FeedRouter };