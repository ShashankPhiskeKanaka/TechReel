import express from "express";
import { errorHandler } from "../../factory/auth.factory.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/zod.middleware.js";
import { UpdateUserData, UserSchema, VerifyMailSchema } from "../../schema/user.schema.js";
import { ControllerFactory } from "../../factory/general.factory.js";
import { UserRepository } from "../repository/user.repository.js";
import { UserService } from "../service/user.service.js";
import { UserController } from "../controller/user.controller.js";
import { DeleteData } from "../../schema/general.schema.js";
import { cacheMiddleware } from "../../factory/cache.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(UserRepository, UserService, UserController);

router.post("/", errorHandler.controllerWrapper(validate(UserSchema)), errorHandler.controllerWrapper(controller.create));
router.get("/verify/:token", errorHandler.controllerWrapper(validate(VerifyMailSchema)), errorHandler.controllerWrapper(controller.verifyEmail));

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PRIVATE"));

// router.post("/info", errorHandler.controllerWrapper(controller.));
router.get("/:id", errorHandler.controllerWrapper(authenticate), errorHandler.controllerWrapper(controller.fetch));
router.delete("/:id", errorHandler.controllerWrapper(DeleteData), errorHandler.controllerWrapper(controller.delete));

router.use(authenticateAdmin);
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateUserData)), errorHandler.controllerWrapper(controller.update));

export { router as UserRouter };