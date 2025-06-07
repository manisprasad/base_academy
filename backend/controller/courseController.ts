// controllers/courseController.ts
import { Request, Response, NextFunction } from "express";
import { Course, CourseContentItem, CourseI } from "../model/Course";
import { Types } from "mongoose";
import { fetchFormattedPlaylistVideos, fetchVideo } from "../utils/fetchPlaylistVideos";

interface CourseParams {
  id: string;
}

// type CourseBody = Partial<Omit<CourseI, "_id courseContent">>;

type CourseBody = Partial<Omit<CourseI, "courseContent">>;

export const createCourse = async (
  req: Request<{}, {}, CourseBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      tags,
      courseLink,
      courseThumbnail,
      category,
      price,
      viewsCount = 0,
      likesCount = 0,
      enrolledUserCount = 0,
      isFree,
      faq,
      prerequisites,
      shortDescription,
      level,
      language,
      duration,
    } = req.body;

    // Validate required fields
    if (
      !title || !description || !category || price === undefined || isFree === undefined ||
      !shortDescription || !level || !language || !courseThumbnail
    ) {
       res.status(400).json({ error: "Missing required course fields." });
       return;
    }

    if (!Array.isArray(courseLink)) {
       res.status(400).json({ error: "courseLink is must be an array" });
       return;
    }

    // Fetch video/playlist metadata and build courseContent
    const courseContent: CourseContentItem[] = await Promise.all(
      courseLink.map(async ({ link, position }) => {
        if (!link || typeof link !== 'string' || typeof position !== 'number') {
          throw new Error("Invalid course link item.");
        }

        if (link.includes("playlist")) {
          const playlistId = new URL(link).searchParams.get("list");
          if (!playlistId) throw new Error("Invalid playlist link.");
          const playlist = await fetchFormattedPlaylistVideos(playlistId);
          return {
            type: "playlist",
            playlist,
            position,
          };
        } else {
          const videoId = new URL(link).searchParams.get("v");
          if (!videoId) throw new Error("Invalid video link.");
          const video = await fetchVideo(videoId);
          return {
            type: "video",
            video,
            position,
          };
        }
      })
    );

    // Sort course content by position
    courseContent.sort((a, b) => a.position - b.position);

    const newCourse = new Course({
      title,
      description,
      tags,
      courseThumbnail,
      courseLink,
      courseContent,
      category,
      price,
      viewsCount,
      likesCount,
      enrolledUserCount,
      isFree,
      faq,
      prerequisites,
      shortDescription,
      level,
      language,
      duration,
    });

    await newCourse.save();

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    next(error);
  }
};

// Get All Courses
export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {start, limit} = req.params
    const courses = await Course.aggregate([
      {
        $project: {
          courseContent: 0 // Exclude courseContent field as they are heavy
        }
      }
    ]);

    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};


// Get Course by ID
export const getCourseById = async (
  req: Request<CourseParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }

    const course = await Course.findById(id)
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// Update Course
export const updateCourse = async (
  req: Request<CourseParams, {}, CourseBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    } 

    const { title, description, tags, courseThumbnail, courseLink } = req.body;
    let updated = false;

    if (title && title !== course.title) {
      course.title = title;
      updated = true;
    }

    if (description && description !== course.description) {
      course.description = description;
      updated = true;
    }

    if (tags && JSON.stringify(tags) !== JSON.stringify(course.tags)) {
      course.tags = tags;
      updated = true;
    }

    if (courseThumbnail && courseThumbnail !== course.courseThumbnail) {
      course.courseThumbnail = courseThumbnail;
      updated = true;
    }

    if (Array.isArray(courseLink)) {
      const newCourseContent: CourseContentItem[] = [];

      for (const { link, position } of courseLink) {
        const existingIndex = course.courseLink.findIndex(
          (item) => item.link === link && item.position === position
        );

        if (existingIndex !== -1) {
          // Reuse existing content
          const existingContent = course.courseContent[existingIndex];
          newCourseContent.push({ ...existingContent, position });
        } else {
          // New or changed link – fetch
          if (link.includes("playlist")) {
            const playlistId = new URL(link).searchParams.get("list");
            if (!playlistId) throw new Error("Invalid playlist link");
            const playlist = await fetchFormattedPlaylistVideos(playlistId);
            newCourseContent.push({ type: "playlist", playlist, position });
          } else {
            const videoId = new URL(link).searchParams.get("v");
            if (!videoId) throw new Error("Invalid video link");
            const video = await fetchVideo(videoId);
            newCourseContent.push({ type: "video", video, position });
          }
          updated = true;
        }
      }

      // Sort by position
      newCourseContent.sort((a, b) => a.position - b.position);

      // Only update courseContent if anything changed
      if (JSON.stringify(newCourseContent) !== JSON.stringify(course.courseContent)) {
        course.courseContent = newCourseContent;
        course.courseLink = courseLink;
        updated = true;
      }
    }

    if (updated) {
      await course.save();
       res.status(200).json({ message: "Course updated successfully", course });
       return;
    } else {
       res.status(200).json({ message: "No changes detected", course });
       return
    }
  } catch (err) {
    next(err);
  }
};




// Delete Course 
export const deleteCourse = async (
  req: Request<CourseParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }

    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    next(error);
  }
};

