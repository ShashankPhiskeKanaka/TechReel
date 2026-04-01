import express from "express";
import { LeaderBoardController } from "../controller/leaderboard.controller.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = express.Router();
const controller = new LeaderBoardController();

router.use(authenticate);

router.get("/:type", errorHandler.controllerWrapper(controller.fetchTopUsers));

export { router as LeaderboardRouter }