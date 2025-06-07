import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userId?: string | Types.ObjectId;
      roles?: number;
    }
  }
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token) {
     res.sendStatus(401); // Unauthorized
     return
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err || !decoded || typeof decoded !== 'object') {
         res.sendStatus(403); // Forbidden
         return;
      }

      const payload = decoded as JwtPayload;

      const userId = payload?.UserInfo?.userId;
      const roles = payload?.UserInfo?.roles;

      if (!userId || !roles){
         res.sendStatus(403);
         return;
      }

      req.userId = userId;
      req.roles = roles;

      next();
    }
  );
};

export default verifyJWT;
