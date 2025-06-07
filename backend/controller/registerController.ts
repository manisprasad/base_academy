import bcrypt from "bcrypt";
import User from "../model/User";
import { Request, Response } from "express";
import { getSubjectsForClass } from "../utils/subjectGenerator";

const handleRegister = async (req: Request, res: Response) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            school,
            classes,
            stream = "", 
            bio,
            profileImage
        } = req.body;

        // ✅ Basic validation
        if (!name || !phone || !password || !classes) {
            res.status(400).json({
                success: false,
                message: "Name, phone, password, and class are required."
            });
             return;
        }

        // ✅ Check for duplicate phone or email
        const existingUser = await User.findOne({ phone:phone }).exec();
        if (existingUser) {
             res.status(409).json({
                success: false,
                message: "Phone number already in use."
            });
            return;
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Determine subjects using utility
        const subjects = getSubjectsForClass(classes, stream);

        // ✅ Create and save user (role will be assigned by default in schema)
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            school,
            classes,
            stream,
            subjects,
            bio,
            profileImage,
            isVerified: false
        });

        await newUser.save();

         res.status(201).json({
            success: true,
            message: "Registered successfully"
        });
        console.log(newUser)
        return;
    } catch (error) {
        console.error("Error in registration:", error);
         res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
        return;
    }
};

export default handleRegister;
