import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { Course } from "../model/Course";
import User from "../model/User";

declare global {
  namespace Express {
    interface Request {
      userId?: string | Types.ObjectId;
      roles?: number; // If you store roles in the token too
    }
  }
}

// Type for route parameters (e.g., /course/:id)
type CourseParams = {
  id: string;
};

// Type for the request body
type PurchaseBody = {
  discountCode?: string,
  deviceInfo?: {
    os?: string;
    browser?: string;
    ip?: string;
    userAgent?: string;
    platform?: string;
    language?: string;
    timezone?: string;
    screen?: {
      width: number;
      height: number;
      devicePixelRatio?: number;
    };
  };
};

export const handleCoursePurchase = async (
  req: Request<CourseParams, {}, PurchaseBody>,
  res: Response
) => {
  const { id } = req.params;

  // ✅ Step 1: Validate course ID
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid course ID" });
    return;
  }

  const courseId = new Types.ObjectId(id);

  // ✅ Step 2: Fetch course data (only needed fields)
  const courseData = await Course.findOne(
    { _id: courseId },
    { title: 1, isFree: 1, price: 1 }
  ).lean();

  if (!courseData) {
    res.status(404).json({ message: "Course not found" });
    return;
  }

  const { isFree, price, title } = courseData;

  // ✅ Step 3: Data sanity check — free course shouldn't have a price
  if (isFree && price > 0) {
    console.error(`Course "${title}" is marked as free but has a price: ${price}`);
    res.status(500).json({
      message: "Course data inconsistency detected. Please contact support.",
    });
    return;
  }

  // ✅ Step 4: Get logged-in user's ID from JWT (set by auth middleware)
  const userIdStr = req.userId;
  if (!userIdStr) {
    res.status(401).json({ message: "Unauthorized: user not found in token." });
    return;
  }

  const userId = new Types.ObjectId(userIdStr);

  // ✅ Step 5: Fetch user from DB
  const user = await User.findById(userId).lean();
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // ✅ Step 6: Check if user already purchased this course
  const alreadyPurchased = user.coursesPurchased?.some((purchasedId: Types.ObjectId) =>
    purchasedId.equals(courseId)
  );

  if (alreadyPurchased) {
    res.status(400).json({ message: "Course already purchased" });
    return;
  }

  // ✅ Step 7: Handle payment or discount (🟡 Placeholder)
  // ----------------------------------------------------
  // If course is paid (isFree = false), you should process payment here.
  // Example steps:
  // 1. Validate & apply discount code (if any)
  // 2. Calculate final price
  // 3. Integrate with payment gateway (e.g., Razorpay, Stripe)
  // 4. Wait for successful confirmation before saving purchase
  //
  // Skip this block if the course is free.
  // ----------------------------------------------------
  // e.g.,
  // if (!isFree) {
  //   const paymentSuccess = await processPayment(userId, courseId, price, req.body.discountCode);
  //   if (!paymentSuccess) {
  //     return res.status(402).json({ message: "Payment failed" });
  //   }
  // }

  // ✅ Step 8: Save the purchase (append courseId to user's purchased list)
  await User.findByIdAndUpdate(userId, {
    $push: { coursesPurchased: courseId }
  });

  // ✅ Step 9: Respond with success
  res.status(200).json({
    success: true,
    message: `Successfully purchased ${title}`,
    course: {
      id: courseId,
      title,
      isFree,
      price
    }
  });
};

export const handleGetAllPurchaseCourse = async (req: Request, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({ message: "Unauthorized: user not found in token." });
      return;
    }

    const userId = new Types.ObjectId(id);

    // Only get coursesPurchased field, and populate only required course fields
    const user = await User.findById(userId)
      .select("coursesPurchased")
      .populate("coursesPurchased", "title courseThumbnail language level")
      .lean();

    if (!user || !user.coursesPurchased) {
      res.status(404).json({
        success: false,
        message: "Purchased courses not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user.coursesPurchased, // Send only the courses, not entire user
    });
    return;
  } catch (error) {
    console.error("Error in getAllPurchaseCourse:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    return;
  }
};


export const handleGetPurchaseCourseById = async (req: Request<CourseParams>, res: Response) => {
  try {
    const { id } = req.params;
    const userIdStr = req.userId;

    if (!userIdStr) {
       res.status(401).json({ success: false, message: "Unauthorized: user not found in token." });
       return;
      }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
       res.status(400).json({ success: false, message: "Invalid course ID." });
       return;
    }

    const userId = new Types.ObjectId(userIdStr);
    const courseId = new Types.ObjectId(id);

    // Check if course exists (optional but recommended)
    const courseExists = await Course.exists({ _id: courseId });
    if (!courseExists) {
       res.status(404).json({ success: false, message: "Course not found." });
       return;
    }

    // Check purchase
    const isPurchased = await User.exists({
      _id: userId,
      coursesPurchased: courseId,
    });

    if (!isPurchased) {
       res.status(403).json({
        success: false,
        message: "Access denied. Please purchase the course to view it.",
      });
      return;
    }

    // Optional: Return the course data
    const course = await Course.findById(courseId, {title: 1, description: 1, courseThumbnail: 1, courseContent: 1, likesCount: 1, enrolledUserCount: 1}).lean(); // exclude unwanted fields

     res.status(200).json({
      success: true,
      message: "Course access granted.",
      data: course,
    });
    return;
  } catch (error) {
    console.error("Error checking purchased course:", error);
     res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
   return;
  }
   
};