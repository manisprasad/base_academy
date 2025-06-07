import { useState } from "react";
import { Clock, Eye,  Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Course } from "../types/courses";

interface CourseCardProps {
  course: Omit<Course, "courseContent">;
  onCourseClick?: (courseId: string) => void;
  className?: string;
}

export function CourseCard({ course, onCourseClick, }: CourseCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number, isFree: boolean) => {
    return isFree ? (
      <span className="inline-block px-2 py-0.5 text-lg font-semibold text-green-300  rounded">
        Free
      </span>
    ) : (
      <span className="inline-block px-2 py-0.5 text-md font-semibold text-white  rounded">
        ₹{price}
      </span>
    );

  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    return minutes > 60 ? `${Math.floor(minutes / 60)}h` : `${minutes}m`;
  };

  const formatCount = (count: number) => {
    return 10; // override for demo
    if (count > 999999) return `${(count / 1000000).toFixed(1)}M`;
    if (count > 999) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const levelColors = {
    beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    advanced: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  };

  return (
    <div
      onClick={() => onCourseClick?.(course._id)}
      className={cn(
        "group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all",
        "bg-card text-card-foreground cursor-pointer flex flex-col h-full",

      )}
    >
      {/* Fixed-height Image */}
      <div className="relative h-36 bg-muted">
        <img
          src={imageError ? "/placeholder.svg" : course.courseThumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <Badge className={`absolute top-2 left-2 text-xs font-medium capitalize ${levelColors[course.level] || "bg-secondary"}`}>
          {course.level}
        </Badge>


      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-between flex-grow space-y-2">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {course.shortDescription || course.description.substring(0, 80)}
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatCount(course.viewsCount)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatCount(course.enrolledUserCount)}
            </span>
          </div>
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(course.duration)}
            </span>
          )}
        </div>



        <div className="flex justify-between">
          <Badge variant="secondary" className="w-max">
            {formatPrice(course.price, course.isFree)}
          </Badge>
          <Button
            size="sm"
            className=" text-xs h-8  hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onCourseClick?.(course._id);
            }}
          >
            {course.isFree ? "Enroll Now" : "View Course"}
          </Button>
        </div>

        {/* CTA Button */}

      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
