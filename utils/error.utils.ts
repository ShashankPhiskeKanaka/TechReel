import type { NextFunction, Request, Response } from "express"
import { logUtil, type logError } from "./log.utils.js";
import { logger } from "./logger.js";

class ErrorHandlerClass {
    controllerWrapper = (fn : any) => {
        return ( req: Request, res: Response, next: NextFunction ) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        }
    }
}

class GlobalErrorHandlerClass {
    handleError = ( err: any, req: Request, res: Response, next: NextFunction ) => {
        logger.error(err.message, {
            status: err.status,
            ip: req.ip
        });

        if(err.status == 403) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
        }

        const status = err.status ?? 500;

        return res.status(status).json({
            success : false,
            message : status == 500 ? "Internal Server Error" : err.message
        });
    }
}

class serverError extends Error {
    public status : number;
    constructor ( errorData : logError ) {
        super(errorData.message);
        this.status = errorData.status;
        this.message = errorData.message;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export { ErrorHandlerClass, GlobalErrorHandlerClass, serverError }