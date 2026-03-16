import express from "express";
import { UserFactory } from "../factory/user.factory.js";
import { errorHandler } from "../factory/auth.factory.js";

const router = express.Router();
const controller = UserFactory.create();

router.post("/", errorHandler.controllerWrapper(controller.create));
router.get("/:token", errorHandler.controllerWrapper(controller.verifyEmail));

export { router as UserRouter };