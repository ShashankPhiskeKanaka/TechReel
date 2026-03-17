import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { errorMessage } from "../constants/error.messages.js";

const validate = (schema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            cookies: req.cookies,
            params: req.params,
            query: req.query
        });

        if(!result.success) {
            logger.warn("Invalid data provided");

            return res.status(errorMessage.INVALIDDATA.status).json({
                success: false,
                message: errorMessage.INVALIDDATA.message
            });
        }

        return next();
    }
}

export { validate }