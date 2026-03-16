import express from "express";
import { UserFactory } from "../factory/user.factory.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const controller = UserFactory.create();

router.post("/", errorHandler.controllerWrapper(controller.create));
router.get("/:token", errorHandler.controllerWrapper(controller.verifyEmail));

// router.post("/info", errorHandler.controllerWrapper(controller.));
router.get("/", authenticate, errorHandler.controllerWrapper(controller.getById));
router.patch("/", authenticate, errorHandler.controllerWrapper(controller.updateProfile));

export { router as UserRouter };