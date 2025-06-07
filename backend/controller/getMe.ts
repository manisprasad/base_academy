import { Response, Request } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export const handleGetMe = (req: Request, res: Response) => {
  const {accessToken} = req.cookies;
  console.log(accessToken)
  if (!accessToken) {
    console.log("Cookies not found here");
     res.status(401).json({
      success: false,
      message: "Not Logged In",
    }); 
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    console.log(decoded)
     res.status(200).json({
      success: true,
      UserInfo: decoded
    });
    return;
  } catch (e) {
     res.status(401).json({
      success: false,
      message: "Access Token expired",
    });
    return;
  }
};
