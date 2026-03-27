import express from "express"
import { ControllerFactory } from "../factory/general.factory.js";
import { ChallengeRepository } from "../repository/challenge.repository.js";
import { ChallengeService } from "../service/challenge.service.js";
import { ChallengeController } from "../controller/challenge.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { DeleteData, GetData } from "../schema/general.schema.js";
import { CreateChallengeData, UpdateChallengeData } from "../schema/challenge.schema.js";

const router = express.Router();
const controller = ControllerFactory.create(ChallengeRepository, ChallengeService, ChallengeController);

router.use(authenticate);

router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.post("/submit", errorHandler.controllerWrapper(controller.createChallengeSubmissionJob));

router.use(authenticateAdmin);
router.post("/", errorHandler.controllerWrapper(CreateChallengeData), errorHandler.controllerWrapper(controller.create));
router.patch("/:id", errorHandler.controllerWrapper(validate(UpdateChallengeData)), errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(validate(DeleteData)), errorHandler.controllerWrapper(controller.delete));


export { router as ChallengeRouter };