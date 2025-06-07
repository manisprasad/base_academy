import { Request, Response } from "express";
import User from "../model/User";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const handleRefreshToken = async (req: Request, res: Response) => {
  const { jwt: refreshToken } = req.cookies;

  if (!refreshToken) {
     res.status(401).json({ message: "Authorization required" });
     return;
  }

  try {
    // Immediately clear the old cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    // Verify token first to get userId for lookup
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as CustomJwtPayload;

    const foundUser = await User.findOne({ 
      _id: decoded.userId,
       // Ensure token matches
    });

    // Token reuse detection
    if (!foundUser) {
      console.warn(`Token reuse detected for user ${decoded.userId}`);
      await User.updateOne(
        { _id: decoded.userId },
        { $unset: { refreshToken: 1 } } // Remove token
      );
       res.status(403).json({ message: "Session expired" });
       return;
    }

    // Generate new tokens
    const accessToken = jwt.sign(
      {UserInfo: { userId: foundUser._id, roles: foundUser.role, name: foundUser.name }},
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "2h" }
    );

    const newRefreshToken = jwt.sign(
      { userId: foundUser._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "15d" }
    );

    // Update with new refresh token
    await User.updateOne(
      { _id: foundUser._id },
      { $set: { refreshToken: newRefreshToken } }
    );

    // Set secure cookie
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    })

     res.json({ 
      success: true,
      message: "updated SuccessFully"
    });
    return;

  } catch (err) {
    if (err instanceof TokenExpiredError) {
       res.status(401).json({ message: "Session expired" });
       return
    }
    if (err instanceof JsonWebTokenError) {
       res.status(403).json({ message: "Invalid token" });
       return;
    }
    
    console.error("Refresh error:", err);
     res.status(500).json({ message: "Authentication service unavailable" });
     return;
  }
};