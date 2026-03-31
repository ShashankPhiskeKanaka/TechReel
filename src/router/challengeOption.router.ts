import express from "express";
import { ControllerFactory } from "../../factory/general.factory.js";
import { ChallengeOptionsRepository } from "../repository/challengeOption.repository.js";
import { ChallengeOptionService } from "../service/challengeOption.service.js";
import { ChallengeOptionController } from "../controller/challengeOption.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../../schema/general.schema.js";
import { UpdateChallengeOptionData } from "../../schema/challengeOptions.schema.js";
import { cacheMiddleware } from "../../factory/cache.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(ChallengeOptionsRepository, ChallengeOptionService, ChallengeOptionController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PUBLIC"));

router.get("/options/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetchAllOptions));

router.use(authenticateAdmin);
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateChallengeOptionData)), errorHandler.controllerWrapper(controller.update));
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

export { router as ChallengeOptionRouter };