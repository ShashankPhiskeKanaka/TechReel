import express from "express";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/zod.middleware.js";
import { UserSchema } from "../schema/user.schema.js";
import { ControllerFactory } from "../factory/general.factory.js";
import { UserRepository } from "../repository/user.repository.js";
import { UserService } from "../service/user.service.js";
import { UserController } from "../controller/user.controller.js";

const router = express.Router();
const controller = ControllerFactory.create(UserRepository, UserService, UserController);

router.use(authenticateAdmin);

router.post("/", errorHandler.controllerWrapper(validate(UserSchema)), errorHandler.controllerWrapper(controller.create));

export { router as AdminRouter };