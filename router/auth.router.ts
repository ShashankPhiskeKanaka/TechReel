import express from "express";
import { AuthFactory, errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.validate.js";
import { LoginSchema, LogoutSchema } from "../schema/auth.schema.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
const controller = AuthFactory.create();

router.post("/", errorHandler.controllerWrapper(validate(LoginSchema)), errorHandler.controllerWrapper(controller.login));
router.get("/:flag", errorHandler.controllerWrapper(validate(LogoutSchema)), errorHandler.controllerWrapper(controller.logout));

export { router as AuthRouter }