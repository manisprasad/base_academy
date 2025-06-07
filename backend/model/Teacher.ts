import mongoose, { Schema, Document } from "mongoose";
import { Roles } from "../config/roleList";

interface TeacherI extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Roles;
  refreshToken: string[];
  department?: string;
  designation?: string;
  bio?: string;
  profileImage?: string;
  courses?: mongoose.Types.ObjectId[];
  isActive?: boolean;
  lastLogin?: Date;
  createdByAdmin?: mongoose.Types.ObjectId;
}

const TeacherSchema: Schema<TeacherI> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
    role: {
      type: Number,
      enum: [Roles.Teacher],
      default: Roles.Teacher,
      required: true,
    },
    department: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    createdByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

export const Teacher = mongoose.model<TeacherI>("Teacher", TeacherSchema);
 