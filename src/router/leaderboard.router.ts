import express from "express";
import { LeaderBoardController } from "../controller/leaderboard.controller.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { cacheMiddleware } from "../factory/cache.factory.js";
import { config } from "../config/index.js";

const router = express.Router();
const controller = new LeaderBoardController();

router.use(authenticate);
router.use(cacheMiddleware.cacheRequest(config.ttlShort, "PUBLIC"));

router.get("/:type", errorHandler.controllerWrapper(controller.fetchTopUsers));
router.get("/", errorHandler.controllerWrapper(controller.streamLeaderboard));
export { router as LeaderboardRouter }