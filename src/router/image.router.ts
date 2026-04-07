import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { ImageRepository } from "../repository/image.repository.js";
import { ImageService } from "../service/image.service.js";
import { ImageController } from "../controller/image.controller.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticateAdmin } from "../middleware/authenticate.middleware.js";

const router = express.Router();
const controller = ControllerFactory.create(ImageRepository, ImageService, ImageController);

router.patch("/aws", errorHandler.controllerWrapper(controller.awsCallback))

router.get("/me", errorHandler.controllerWrapper(controller.fetch));
router.patch("/:id", errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(controller.delete));

router.use(authenticateAdmin);
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

export { router as Imagerouter };