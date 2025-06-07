// routes/courseRoute.ts
import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controller/courseController";

const courseRoute = express.Router();

courseRoute.post("/", createCourse);
courseRoute.get("/", getAllCourses);
courseRoute.get("/:id", getCourseById);
courseRoute.put("/:id", updateCourse);
courseRoute.delete("/:id", deleteCourse);

export default courseRoute;