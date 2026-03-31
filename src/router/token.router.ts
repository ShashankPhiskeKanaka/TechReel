import express from "express";
import { TokenFactory } from "../../factory/token.factory.js";
import { TokenRepository } from "../repository/token.repository.js";
import { TokenService } from "../service/token.service.js";
import { TokenController } from "../controller/token.controller.js";
import { errorHandler } from "../../factory/auth.factory.js";
import { authenticate, authenticateAdmin } from "../middleware/authenticate.middleware.js";
import { validate } from "../middleware/zod.middleware.js";
import { DeleteToken, GetToken, TokenData } from "../../schema/token.schema.js";
import { idempotencyMiddleware } from "../middleware/idempotency.middleware.js";
import { DeleteData } from "../../schema/general.schema.js";
import { cacheMiddleware } from "../../factory/cache.factory.js";

const router = express.Router();
const controller = TokenFactory.create(TokenRepository, TokenService, TokenController);

router.use(authenticate);

router.use(cacheMiddleware.cacheRequest(Number(process.env.CACHE_TTL_SHORT), "PUBLIC"));

router.get("/:id", errorHandler.controllerWrapper(validate(GetToken)), errorHandler.controllerWrapper(controller.fetch));
router.get("/", errorHandler.controllerWrapper(controller.fetchAll));

router.use(authenticateAdmin);
router.post("/", errorHandler.controllerWrapper(validate(TokenData)), errorHandler.controllerWrapper(controller.create));
router.patch("/", errorHandler.controllerWrapper(validate(TokenData)), errorHandler.controllerWrapper(controller.update));
router.delete("/:id", errorHandler.controllerWrapper(validate(DeleteData)), errorHandler.controllerWrapper(controller.delete));

export { router as TokenRouter };