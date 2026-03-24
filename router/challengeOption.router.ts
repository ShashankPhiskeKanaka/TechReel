import express from "express";
import { ControllerFactory } from "../factory/general.factory.js";
import { ChallengeOptionsRepository } from "../repository/challengeOptions.repository.js";
import { ChallengeOptionService } from "../service/challengeOption.service.js";
import { ChallengeOptionController } from "../controller/challengeOption.controller.js";
import { authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../schema/general.schema.js";
import { ChallengeOptionUpdateData } from "../schema/challenge.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(ChallengeOptionsRepository, ChallengeOptionService, ChallengeOptionController);

router.use(authenticateAdmin);

router.patch("/:id", errorHandler.controllerWrapper(validate(ChallengeOptionUpdateData)), errorHandler.controllerWrapper(controller.update));
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));

export { router as ChallengeOptionRouter };