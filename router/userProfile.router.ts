import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { UserProfileRepository } from "../repository/userProfile.repository.js";
import { UserProfileService } from "../service/userProfile.service.js";
import { UserProfileController } from "../controller/userProfile.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { GetData } from "../schema/general.schema.js";
import { validate } from "../middleware/zod.middleware.js";
import { CreateUserProfileSchema, UpdateUserProfileData } from "../schema/userProfile.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(UserProfileRepository, UserProfileService, UserProfileController);

router.use(authenticate);

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));
router.post("/", errorHandler.controllerWrapper(validate(CreateUserProfileSchema)), errorHandler.controllerWrapper(controller.create));
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateUserProfileData)), errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.delete));

export { router as UserProfileRouter };