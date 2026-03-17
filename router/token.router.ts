import express from "express";
import { TokenFactory } from "../factory/token.factory.js";
import { TokenRepository } from "../repository/token.repository.js";
import { TokenService } from "../service/token.service.js";
import { TokenController } from "../controller/token.controller.js";
import { errorHandler } from "../factory/auth.factory.js";
import { authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/zod.middleware.js";
import { DeleteToken, GetToken, TokenData } from "../schema/token.schema.js";
import { idempotencyMiddleware } from "../middleware/idempotency.middleware.js";

const router = express.Router();
const controller = TokenFactory.create(TokenRepository, TokenService, TokenController);

router.use(authenticateAdmin);
router.use(idempotencyMiddleware);
router.post("/", errorHandler.controllerWrapper(validate(TokenData)), errorHandler.controllerWrapper(controller.create));
router.get("/:id", errorHandler.controllerWrapper(validate(GetToken)), errorHandler.controllerWrapper(controller.get));
router.patch("/", errorHandler.controllerWrapper(validate(TokenData)), errorHandler.controllerWrapper(controller.update));
router.delete("/:flag", errorHandler.controllerWrapper(validate(DeleteToken)), errorHandler.controllerWrapper(controller.delete));

export { router as TokenRouter };