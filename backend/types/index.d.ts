import "express";
import "jsonwebtoken";
import { Roles } from "../config/roleList";

// Augment Express Request (this part works for you already)
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      roles?:Roles
    }
  }
}

// ✅ Augment JwtPayload properly
declare module "jsonwebtoken" {
  export interface JwtPayload {
    UserInfo?: {
      userId: string;
      roles?: Roles;
    };
    userId: string
  }
}
