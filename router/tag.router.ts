import express from "express";
import { TagController } from "../controller/tag.controller.js";
import { TagFactory } from "../factory/tag.factory.js";
import { TagRepository } from "../repository/tag.repository.js";
import { TagService } from "../service/tag.service.js";
import { authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { TagSchema } from "../schema/tag.schema.js";
import { GetData } from "../schema/general.schema.js";

const router = express.Router();
const controller = TagFactory.create(TagRepository, TagService, TagController);

router.use(authenticateAdmin);

router.post("/", errorHandler.controllerWrapper(validate(TagSchema)), errorHandler.controllerWrapper(controller.create));
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.get));
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.delete));

export { router as TagRouter };