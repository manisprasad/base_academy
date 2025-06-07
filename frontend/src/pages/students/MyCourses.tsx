import { useFetch } from "@/hooks/useFetchHook"
import { Play, Globe, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface Course {
  _id: string
  title: string
  courseThumbnail: string
  level: "beginner" | "intermediate" | "advanced"
  language: string
  courseType?: "Free" | "Paid" | "Live" | "Self-paced"
}

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const MyCourses = () => {
   const navigate = useNavigate();
  const { data, loading, error } = useFetch<{
    succcess: boolean
    message: string
    data: Course[]
  }>("/api/student/my-courses/", {
    method: "GET",
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-muted shadow">
            <div className="aspect-video bg-muted-foreground/20" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
              <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
              <div className="h-8 bg-muted-foreground/20 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4">
        <div className="p-6 text-center max-w-md w-full bg-background border border-border rounded-xl">
          <div className="text-red-500 mb-4">
            <TrendingUp className="h-10 w-10 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4 text-sm">Please refresh the page and try again.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4">
        <div className="p-6 text-center max-w-md w-full bg-background border border-border rounded-xl">
          <div className="text-muted-foreground mb-4">
            <Play className="h-10 w-10 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Courses Found</h3>
          <p className="text-muted-foreground text-sm">You haven't enrolled in any courses yet.</p>
        </div>
      </div>
    )
  }

 
  

  return (
    <div className="container mx-auto px-3 py-4 mt-10">
      <div className="mb-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">My Courses</h1>
        <p className="text-muted-foreground text-sm">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((course) => (
          <div
            key={course._id}
            className="bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={course.courseThumbnail || "/placeholder.svg?height=200&width=400"}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=200&width=400"
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="h-10 w-10 text-white" />
              </div>
            </div>

            <div className="p-3 space-y-2">
              <h3 className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>

              <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium mb-1",
                    levelColors[course.level.toLowerCase()] || "bg-muted text-muted-foreground"
                  )}
                >
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>

                <div className="flex items-center gap-1 mb-1">
                  <Globe className="h-4 w-4" />
                  <span>{course.language}</span>
                </div>
              </div>

          

              <Button onClick={() => {
                navigate(`/student/my-courses/${course._id}`)
              }} className="w-full mt-2 text-xs py-2 gap-2" size="sm">
                <Play className="h-4 w-4" />
                Continue
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyCourses
