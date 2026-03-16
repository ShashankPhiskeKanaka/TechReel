import express from "express";
import { AuthFactory, errorHandler } from "../factory/auth.factory.js";

const router = express.Router();
const controller = AuthFactory.create();

router.post("/", errorHandler.controllerWrapper(controller.login));
router.get("/:flag", errorHandler.controllerWrapper(controller.logout));

export { router as AuthRouter }