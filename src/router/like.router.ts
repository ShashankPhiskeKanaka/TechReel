import express from "express";
import { ControllerFactory } from "../../factory/general.factory.js";
import { LikeRepository } from "../repository/like.repository.js";
import { LikeService } from "../service/like.service.js";
import { LikeController } from "../controller/like.controller.js";
import { errorHandler } from "../../factory/auth.factory.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { GetData } from "../../schema/general.schema.js";
import { validate } from "../middleware/zod.middleware.js";
import { cacheMiddleware } from "../../factory/cache.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(LikeRepository, LikeService, LikeController);

router.use(authenticate);

router.get("/count/:id", cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PUBLIC"), errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetchLikeCount));

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PRIVATE"));

router.post("/", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.likeReel));
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.unlikeReel));
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

export { router as LikeRouter };