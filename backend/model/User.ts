import mongoose, { Document, Schema , Types} from "mongoose";
import { Roles } from "../config/roleList";
import { getSubjectsForClass, Stream } from "../utils/subjectGenerator";

export interface IUser extends Document {
  name: string;
  email?: string;
  gender: "Male" | "Female" | "Other"
  phone: string;
  refreshToken: string[]
  password: string;
  school?: string;
  classes: string; // e.g., "6", "10", "11", "12"
  stream?: Stream; // Only for class 11 or 12
  subjects: string[];
  bio?: string;
  profileImage?: string;
  role: Roles;
  isVerified: boolean; 
  createdAt: Date;
  updatedAt: Date;
  coursesPurchased:Types.ObjectId[];
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    gender:{
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    school: {
      type: String
    },
    classes: {
      type: String,
      required: true,
      enum: ["6", "7", "8", "9", "10", "11", "12"]
    },
    stream: {
      type: String,
      enum: ["Science", "Commerce", "Arts", ""],
      required: function (this: IUser) {
        return this.classes === "11" || this.classes === "12";
      }
    },
    subjects: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      maxlength: 500
    },
    refreshToken: {
      type: [String],
      default:[]
    },
    coursesPurchased: {
      type: [Schema.Types.ObjectId],
      ref: "Course",
      default: []
    },
    profileImage: {
      type: String
    },
    role: {
      type: Number,
      default: Roles.Student
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate subjects before saving
userSchema.pre<IUser>("save", function (next) {
  if (!this.subjects || this.subjects.length === 0) {
    this.subjects = getSubjectsForClass(this.classes, this.stream);
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
