import express from "express";
import { ControllerFactory } from "../../factory/general.factory.js";
import { ChallengeSubmissionRepository } from "../repository/challengeSubmission.repository.js";
import { ChallengeSubmissionService } from "../service/challengeSubmission.service.js";
import { ChallengeSubmissionController } from "../controller/challengeSubmission.controller.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { errorHandler } from "../../factory/auth.factory.js";
import { validate } from "../middleware/zod.middleware.js";
import { DeleteData, GetData } from "../../schema/general.schema.js";
import { CreateChallengeSubmissionData } from "../../schema/challengeSubmission.schema.js";
import { cacheMiddleware } from "../../factory/cache.factory.js";

const router = express.Router();
const controller = ControllerFactory.create(ChallengeSubmissionRepository, ChallengeSubmissionService, ChallengeSubmissionController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PRIVATE"));

router.post("/", errorHandler.controllerWrapper(validate(CreateChallengeSubmissionData)), errorHandler.controllerWrapper(controller.createChallengeSubmissionJob));
router.get("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.use(authenticateAdmin);
router.delete("/:id", errorHandler.controllerWrapper(validate(GetData)), errorHandler.controllerWrapper(controller.delete));

export { router as ChallengeSubmissionRouter };