import express from "express"
import { ControllerFactory } from "../factory/general.factory.js";
import { ChallengeRepository } from "../repository/challenge.repository.js";
import { ChallengeService } from "../service/challenge.service.js";
import { ChallengeController } from "../controller/challenge.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { GetData } from "../schema/general.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(ChallengeRepository, ChallengeService, ChallengeController);

router.use(authenticate);

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/reel/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));

router.use(authenticateAdmin);
router.post("/", errorHandler.controllerWrapper(controller.created));
router.patch("/:id", errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(controller.delete));


export { router as ChallengeRouter };