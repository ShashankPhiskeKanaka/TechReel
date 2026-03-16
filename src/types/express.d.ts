import type { Request } from "express";
import * as express from "express-static-server-core"
import type { Role } from "../../dto/user.dto.ts";

declare global {
    namespace Express {
        interface User {
            id: string,
            role: role,
            email? : string
        }
        interface Request {
            authUser? : User
        }
    }
}

declare module 'express-static-server-core' {
    interface Response {
        sendResponse? : (body: any) => Response
    }
}