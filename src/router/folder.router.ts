import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { FolderRepository } from "../repository/folder.repository.js";
import { FolderService } from "../service/folder.service.js";
import { FolderController } from "../controller/folder.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../zod.schema/general.schema.js";
import { CreateFolderSchema, UpdateFolderSchema } from "../zod.schema/folder.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(FolderRepository, FolderService, FolderController);

router.use(authenticate);

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.post("/", errorHandler.controllerWrapper(validate(CreateFolderSchema)), errorHandler.controllerWrapper(controller.create));
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateFolderSchema)), errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.delete));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

export { router as FolderRouter };