import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { ViewRepository } from "../repository/view.repository.js";
import { ViewService } from "../service/view.service.js";
import { ViewController } from "../controller/view.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../schema/general.schema.js";
import { cacheMiddleware } from "../factory/cache.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(ViewRepository, ViewService, ViewController);

router.use(authenticate);

router.get("/count/:id", cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PUBLIC"), errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetchViews));

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PRIVATE"));

router.post("/", errorHandler.controllerWrapper(controller.createView));
router.get("/:id", errorHandler.controllerWrapper(controller.fetch));

router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.use(authenticateAdmin);
router.patch("/:id", errorHandler.controllerWrapper(controller.updateView));
router.delete("/:id", errorHandler.controllerWrapper(controller.delete));

export { router as ViewRouter };