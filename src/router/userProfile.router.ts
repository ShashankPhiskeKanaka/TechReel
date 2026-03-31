import express from "express";
import { ControllerFactory } from "../../factory/general.factory.js";
import { UserProfileRepository } from "../repository/userProfile.repository.js";
import { UserProfileService } from "../service/userProfile.service.js";
import { UserProfileController } from "../controller/userProfile.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../../factory/auth.factory.js";
import { GetData } from "../../schema/general.schema.js";
import { validate } from "../middleware/zod.middleware.js";
import { CreateUserProfileSchema, UpdateUserProfileData } from "../../schema/userProfile.schema.js";
import { cacheMiddleware } from "../../factory/cache.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(UserProfileRepository, UserProfileService, UserProfileController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PRIVATE"));

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.post("/", errorHandler.controllerWrapper(validate(CreateUserProfileSchema)), errorHandler.controllerWrapper(controller.create));
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateUserProfileData)), errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.delete));

router.use(authenticateAdmin);
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

export { router as UserProfileRouter };