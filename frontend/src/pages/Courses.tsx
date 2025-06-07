import { useFetch } from "../hooks/useFetchHook";
import { type Course } from "../types/courses";
import { CourseCard } from "../components/CourseCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

type CoursesT = Omit<Course, "courseContent">;

const Courses = () => {
  const { data, error, loading } = useFetch<CoursesT[]>("/api/courses/", {
    method: "GET",
  });
  const navigate = useNavigate();

  if (error) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
        <h3 className="text-lg font-medium text-red-600">Error loading courses</h3>
        <p className="mt-2 text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const handleCourseClick = (id: string) => {
    if(!id) return;
    navigate(`/course/${id}`)
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Our Courses</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Find the perfect course for your learning journey
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search courses by title, instructor..."
            className="w-full pl-10 pr-4 py-6 rounded-lg border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Select>
            <SelectTrigger className="flex items-center gap-2 py-6 px-4 w-full sm:w-48">
              <FilterIcon className="h-5 w-5 text-gray-500" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="humanities">Humanities</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="py-6 px-4 w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <Skeleton className="h-48 w-full bg-gray-200 dark:bg-gray-700" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-3 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-2/3 mb-4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Grid */}
      {data && (
        <>
          {data.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No courses found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data.map((course, index) => (
                <CourseCard key={course._id || index} course={course} onCourseClick={() => handleCourseClick(course._id)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;