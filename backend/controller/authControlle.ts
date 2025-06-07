import User, { IUser } from "../model/User";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from "express";


const handleLogin = async (req: Request, res: Response) => {

    const cookies = req.cookies;
    const { phone, password } = req.body;

    if (!phone || !password) {
         res.status(400).json({
            success: false,
            message: "Phone number and password are required!"
        });
        return;
    }

    const existingUser: IUser | null = await User.findOne({ phone }).exec();

    if (!existingUser) {
         res.status(401).json({
            success: false,
            message: "Mobile number doesn't exist"
        });
        return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
         res.status(401).json({
            success: false,
            message: "Phone or password is incorrect"
        });
        return;
    }

    // 🛡️ Access Token (Short-lived)
    const accessToken = jwt.sign(
        {
            UserInfo: {
                name: existingUser.name,
                userId: existingUser._id,
                roles: existingUser.role
            }
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '2h' }
    );

    // 🔁 Refresh Token (Long-lived)
    const newRefreshToken = jwt.sign(
        { userId: existingUser._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '15d' }
    );

    // 🔒 Detect refresh token reuse
    let newRefreshTokenArray = existingUser.refreshToken || [];

    if (cookies?.jwt) {
        const previousRefreshToken = cookies.jwt;
        const tokenOwner = await User.findOne({ refreshToken: previousRefreshToken }).exec();

        if (!tokenOwner) {
            console.warn("⚠️ Possible refresh token reuse detected!");
            // Token might have been stolen. Clear all tokens for safety.
            newRefreshTokenArray = [];
        } else {
            // Remove the previous refresh token from the list
            newRefreshTokenArray = existingUser.refreshToken.filter(rt => rt !== previousRefreshToken);
        }

        // Clear the old refresh cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    }

    // ✅ Update refresh tokens in DB
    newRefreshTokenArray.push(newRefreshToken);
    existingUser.refreshToken = newRefreshTokenArray;
    await existingUser.save();

    // 🍪 Set cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge:  2 * 60 * 60 * 1000// 2 hour
    });



    res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
    });

     res.status(200).json({ success: true, message: "Login successful", data: {
        name: existingUser.name,
        userId: existingUser._id,
        roles: existingUser.role,
     } });
     return;
};

export default handleLogin;

