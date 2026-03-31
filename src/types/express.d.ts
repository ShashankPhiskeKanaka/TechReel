import type { Request } from "express";
import * as express from "express-static-server-core"
import type { Role } from "../dto/user.dto.ts";

declare global {
  namespace Express {
    // This is the specific interface Passport uses
    interface User {
      id: string;
      role: Role
      // Add other fields if your Service needs them (email, etc.)
    }

    interface Request {
      // req.user is now strictly typed with id and role
      user?: User;
    }
  }
}

declare module 'express-static-server-core' {
  interface Response {
    sendResponse?: (body: any) => Response
  }
}