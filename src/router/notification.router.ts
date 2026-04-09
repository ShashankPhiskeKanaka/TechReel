import express from "express";
import { NotificationController } from "../controller/notification.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";

const router = express.Router();
const controller = new NotificationController();

router.use(authenticate);

router.get("/stream", errorHandler.controllerWrapper(controller.notification));

export { router as NotificationRouter };