"use client"

import { useFetch } from "@/hooks/useFetchHook"
import { useParams } from "react-router-dom"
import { Play, ListVideo, FileText, CheckCircle, Menu, X, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useMediaQuery } from "@/hooks/use-mobile"
import DescriptionWithToggle from "@/components/DescriptionWithToggle"

// Types
type Video = {
  videoId: string
  title: string
  description: string
  duration: string
  thumbnails: {
    low: string
    max: string
    high: string
  }
}

type Playlist = {
  title: string
  description: string
  tags: string[]
  playListId: string
  playlistThumbnail: string
  videos: Video[]
  orderedId: number
}

type CourseContentItem = {
  type: "video" | "playlist"
  position: number
  video?: Video
  playlist?: Playlist
}

interface UserCourseI {
  title: string
  description: string
  courseThumbnail: string
  courseContent: CourseContentItem[]
  likesCount: number
  enrolledUserCount: number
}

const Learning = () => {
  const { id } = useParams()
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [progress, setProgress] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const { data, loading, error } = useFetch<{
    success: string
    message: string
    data?: UserCourseI
  }>(`/api/student/my-courses/${id}`, {
    method: "GET",
  })




  // Calculate progress whenever completedVideos changes
  useEffect(() => {
    if (data?.data) {
      const totalVideos = countVideos(data.data.courseContent)
      const completedCount = completedVideos.size
      setProgress(totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0)
    }
  }, [completedVideos, data])

  const markAsCompleted = (videoId: string) => {
    setCompletedVideos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  // Set first video as selected when data loads
  useEffect(() => {
    if (data?.data && !selectedVideo) {
      const firstVideo = findFirstVideo(data.data.courseContent)
      if (firstVideo) setSelectedVideo(firstVideo)
    }
  }, [data, selectedVideo])

  function findFirstVideo(content: CourseContentItem[]): Video | null {
    for (const item of content) {
      if (item.type === "playlist" && item.playlist?.videos.length) {
        return item.playlist.videos[0]
      }
      if (item.video) {
        return item.video
      }
    }
    return null
  }

  if (loading)
    return (
      <div className="flex flex-col md:flex-row h-screen bg-background">
        <div className="w-full md:w-1/4 p-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-6 w-5/6" />
            </div>
          ))}
        </div>
        <div className="w-full md:w-3/4 p-4">
          <Skeleton className="w-full aspect-video mb-6" />
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    )

  if (error || !data?.data)
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center p-8 border rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-4">Oops! Something went wrong</h2>
          <p className="text-lg mb-6">We couldn't load your course right now.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )

  const course = data.data

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background mt-10">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <h1 className="font-bold text-lg truncate flex-1 text-center">{course.title}</h1>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Chapters Sidebar */}
      <div
        className={`${sidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-80 lg:w-96 border-r bg-background z-20 md:z-auto absolute md:relative inset-0 md:inset-auto overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent`}
      >

        <div className="p-4 border-b hidden md:block">
          <h2 className="font-bold text-xl">{course.title}</h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              {course.courseContent.length} chapters • {countVideos(course.courseContent)} videos
            </p>
            <Badge variant="outline" className="ml-2">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>

        <div className="divide-y">
          {course.courseContent.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="py-3">
              <div className="px-4 py-2 font-medium flex items-center gap-2 text-lg">
                <Badge variant="outline" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">
                  {chapterIndex + 1}
                </Badge>
                <span className="truncate">
                  {chapter.type === "playlist" ? chapter.playlist?.title : chapter.video?.title}
                </span>
              </div>

              {chapter.type === "playlist" ? (
                <div className="space-y-1 mt-2">
                  {chapter.playlist?.videos.map((video) => (
                    <button
                      key={video.videoId}
                      className={`flex items-center w-full px-4 py-3 text-left hover:bg-accent/50 rounded-lg mx-2 ${selectedVideo?.videoId === video.videoId ? "bg-accent" : ""
                        }`}
                      onClick={() => {
                        setSelectedVideo(video)
                        if (isMobile) setSidebarOpen(false)
                      }}
                    >
                      <div className="mr-3 flex-shrink-0">
                        {completedVideos.has(video.videoId) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Play className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base truncate font-medium">{video.title}</p>
                        <p className="text-sm text-muted-foreground">{video.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : chapter.video ? (
                <button
                  className={`flex items-center w-full px-4 py-3 text-left hover:bg-accent/50 rounded-lg mx-2 ${selectedVideo?.videoId === chapter.video.videoId ? "bg-accent" : ""
                    }`}
                  onClick={() => {
                    if (chapter.video) {
                      setSelectedVideo(chapter.video)
                      if (isMobile) setSidebarOpen(false)
                    }
                  }}
                >
                  <div className="mr-3 flex-shrink-0">
                    {completedVideos.has(chapter.video.videoId) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Play className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base truncate font-medium">{chapter.video.title}</p>
                    <p className="text-sm text-muted-foreground">{chapter.video.duration}</p>
                  </div>
                </button>
              ) : (
                <div className="px-4 py-3 flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span className="text-base text-muted-foreground">Reading material</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {selectedVideo ? (
          <div className="p-4 md:p-6 lg:p-8">
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold">{selectedVideo.title}</h1>
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden md:flex"
                    aria-label={sidebarOpen ? "Hide chapters" : "Show chapters"}
                  >
                    {sidebarOpen ? (
                      <>
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Hide chapters
                      </>
                    ) : (
                      <>
                        <ListVideo className="h-4 w-4 mr-2" />
                        Show chapters
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* <p className="text-base text-muted-foreground mt-3">{selectedVideo.description}</p> */}
              <DescriptionWithToggle text={selectedVideo.description} />
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  variant={completedVideos.has(selectedVideo.videoId) ? "default" : "outline"}
                  onClick={() => markAsCompleted(selectedVideo.videoId)}
                  className="text-base py-6"
                >
                  {completedVideos.has(selectedVideo.videoId) ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Completed!
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as complete
                    </>
                  )}
                </Button>

                {isMobile && (
                  <Button variant="secondary" size="lg" onClick={() => setSidebarOpen(true)} className="text-base py-6">
                    <ListVideo className="h-5 w-5 mr-2" />
                    View chapters
                  </Button>
                )}
              </div>

              {/* Progress indicator for mobile */}
              <div className="mt-8 md:hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your progress</span>
                  <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center max-w-md">
              <div className="bg-primary/10 p-6 rounded-full inline-flex items-center justify-center mb-6">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Let's start learning!</h3>
              <p className="text-muted-foreground mb-6">
                Choose a video from the chapters list to begin your learning journey
              </p>
              {isMobile && (
                <Button onClick={() => setSidebarOpen(true)} size="lg">
                  <ListVideo className="h-5 w-5 mr-2" />
                  View chapters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function countVideos(content: CourseContentItem[]): number {
  return content.reduce((count, item) => {
    if (item.type === "playlist") return count + (item.playlist?.videos.length || 0)
    if (item.video) return count + 1
    return count
  }, 0)
}

export default Learning
