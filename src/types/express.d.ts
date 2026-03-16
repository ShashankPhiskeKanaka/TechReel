import type { Request } from "express";
import * as express from "express-static-server-core"

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string,
                role: string
            }
        }
    }
}

declare module 'express-static-server-core' {
    interface Response {
        sendResponse? : (body: any) => Response
    }
}