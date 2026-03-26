import type { Request, Response } from "express";
import type { GamificationService } from "../service/gamification.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";

class GamificationController {
    constructor(private GamificationService: GamificationService) {}


}

export { GamificationController }