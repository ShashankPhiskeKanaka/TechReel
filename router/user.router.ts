import express from "express";
import { UserFactory } from "../factory/user.factory.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/zod.validate.js";
import { UserSchema, VerifyMailSchema } from "../schema/user.schema.js";
import { UserProfileSchema } from "../schema/userProfile.schema.js";

const router = express.Router();
const controller = UserFactory.create();

router.post("/", errorHandler.controllerWrapper(validate(UserSchema)), errorHandler.controllerWrapper(controller.create));
router.get("/:token", errorHandler.controllerWrapper(validate(VerifyMailSchema)), errorHandler.controllerWrapper(controller.verifyEmail));

// router.post("/info", errorHandler.controllerWrapper(controller.));
router.get("/", errorHandler.controllerWrapper(authenticate), errorHandler.controllerWrapper(controller.getById));
router.patch("/", errorHandler.controllerWrapper(authenticate), errorHandler.controllerWrapper(validate(UserProfileSchema)), errorHandler.controllerWrapper(controller.updateProfile));

export { router as UserRouter };