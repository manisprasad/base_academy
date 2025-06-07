
import { useParams } from "react-router-dom"
import type { Course } from "@/types/courses"
import { useFetch } from "@/hooks/useFetchHook"
import FAQ from "@/components/Faq"
import {
    CheckCircle2,
    Clock,
    BarChart2,
    ListChecks,
    Play,
    BookOpen,
    HelpCircle,
    Star,
    Users,
    Award,
    Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { axiosInstance } from "@/api/axios"
import { toast } from "sonner"


export const CourseDetails = () => {
    const { id } = useParams()
    const { data: course, loading, error } = useFetch<Course>(`/api/courses/${id}`, { method: "GET" })

    if (error)
        return (
            <div className="container py-8 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error loading course</h2>
                    <p className="text-red-500 dark:text-red-400">We couldn't load the course details. Please try again later.</p>
                    <Button variant="outline" className="mt-4">
                        Refresh Page
                    </Button>
                </div>
            </div>
        )

    const handlePurchase = async(id: string) => {
        const data = await axiosInstance.post(`api/purchase/${id}`, {});
        if(data.data.success){
            toast.success("Course sucessfully Purchased in development mode", {
                description: `Title: ${data.data.title}`
            })
        }
    }

    return (
        <div className="min-h-screen mt-10">
            {/* Hero Section */}
            <div className="border-b ">
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <div className="grid gap-8 lg:gap-12 xl:grid-cols-3">
                        {/* Main Content */}
                        <div className="xl:col-span-2 space-y-8">
                            {loading ? (
                                <>
                                    <Skeleton className="h-12 w-3/4 mb-4" />
                                    <Skeleton className="h-6 w-1/2 mb-6" />
                                    <div className="flex gap-2 mb-6">
                                        {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-7 w-20 rounded-full" />
                                        ))}
                                    </div>
                                    <Skeleton className="h-80 w-full rounded-2xl mb-6" />
                                </>
                            ) : course ? (
                                <>
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {course.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-0"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div>
                                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                                                {course.title}
                                            </h1>
                                            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {course.shortDescription}
                                            </p>
                                        </div>

                                        {/* Course Stats */}
                                        <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">4.8</span>
                                                <span>(2,847 reviews)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>12,543 students</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                <span>{course.language}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Preview */}
                                    <div className="relative aspect-video border-1 overflow-hidden rounded-2xl w-full max-w-3xl mx-auto shadow-lg">
                                        <img
                                            src={course.courseThumbnail || "/placeholder.svg"}
                                            alt={course.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                            <Button
                                                size="lg"
                                                className="rounded-full h-14 w-14 md:h-16 md:w-16 bg-white/95 hover:bg-white text-slate-900 shadow-lg hover:scale-105 transition-all duration-200"
                                            >
                                                <Play className="h-6 w-6 md:h-7 md:w-7 fill-current ml-0.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {/* Desktop Sidebar */}
                        <div className="hidden xl:block space-y-6 ">
                            {loading ? (
                                <Card className="p-8 shadow-xl">
                                    <Skeleton className="h-10 w-1/2 mb-6" />
                                    <Skeleton className="h-12 w-full rounded-lg mb-6" />
                                    <div className="space-y-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <Skeleton className="h-5 w-5 rounded-full" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ) : course ? (
                                <Card className="p-8 shadow-xl border-1 ">
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-3 mb-2">
                                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                                    {course.isFree ? "Free" : `$${course.price.toFixed(2)}`}
                                                </span>
                                                {!course.isFree && (
                                                    <span className="text-lg text-slate-500 dark:text-slate-400 line-through">
                                                        ${(course.price * 1.2).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            {!course.isFree && (
                                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                    Save ${(course.price * 1.2 - course.price).toFixed(2)} today!
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => handlePurchase(course._id)}
                                            className="w-full h-12 text-lg font-semibold hover:bg-white/50 hover:cursor-pointer  shadow-lg hover:shadow-xl transition-all duration-200"
                                            size="lg"
                                        >
                                            {course.isFree ? "Enroll Now" : "Buy Now"}
                                        </Button>



                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">This course includes:</h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    <span>{course.duration ? `${course.duration} hours of content` : "Self-paced learning"}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    <span className="capitalize">{course.level} level</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <ListChecks className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    <span>{course.courseContent.length} modules</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    <span>Certificate of completion</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/4" />
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                ) : course ? (
                    <div className="p-2">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">About This Course</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p className="leading-relaxed">{course.description}</p>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Course Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Course Content</h2>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full rounded-xl" />
                        ))}
                    </div>
                ) : course ? (
                    <div className="space-y-4">
                        {course.courseContent.map((item, index) => (
                            <div
                                key={index}
                                className="p-6 hover:shadow-lg transition-all duration-200  border-0 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                                                {item.type === "video" ? item.video?.title : item.playlist?.title}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                                                {item.type === "video" ? (
                                                    <>
                                                        <Play className="h-4 w-4" />
                                                        <span>{item.video?.duration}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ListChecks className="h-4 w-4" />
                                                        <span>{item.playlist?.videos.length} lessons</span>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>

            {/* Requirements Section */}
            {course?.prerequisites && course.prerequisites.length > 0 && (
                <div className="container mx-auto px-4 py-12">
                    <div className="p-8 shadow-lg border-0 ">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Requirements</h2>
                        <ul className="space-y-4">
                            {course.prerequisites.map((req, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-700 dark:text-slate-300 text-lg">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* FAQ Section */}
            {course?.faq && course.faq.length > 0 && (
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-3 mb-8">
                        <HelpCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="p-8 shadow-lg border-0 ">
                        <FAQ questions={course?.faq} />
                    </div>
                </div>
            )}

            {/* Mobile Sticky Bottom Bar */}
            <div className="xl:hidden fixed border-2  left-0 right-0 bottom-2 backdrop-blur-3xl w-11/12 mx-auto rounded-xl  px-4 py-2 shadow-2xl z-50">
                {loading ? (
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-12 w-32 rounded-lg" />
                    </div>
                ) : course ? (
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {course.isFree ? "Free" : `$${course.price.toFixed(2)}`}
                                </span>
                                {!course.isFree && (
                                    <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                                        ${(course.price * 1.2).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            {!course.isFree && (
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Limited time offer</p>
                            )}
                        </div >
                        <Button
                            onClick={() => {
                                handlePurchase(course._id)
                            }}
                            className="px-8 py-3 text-lg font-semibold hover:cursor-pointer rounded-md shadow-lg"
                            size="lg"
                        >
                            {course.isFree ? "Enroll Now" : "Buy Now"}
                        </Button>
                    </div>
                ) : null}
            </div>

            {/* Mobile spacing for sticky bar */}
            <div className="xl:hidden h-20"></div>
        </div>
    )
}
