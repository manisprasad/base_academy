
// ----- Video Type -----
export type Video = {
    videoId: string;
    title: string;
    description: string;
    duration: string;
    thumbnails: {
        low: string,
        max: string,
        high: string
    };
    // Add any other video fields you use
};

// ----- Playlist Type -----
export type Playlist = {
    title: string;
    description: string;
    tags: string[];
    playListId: string;
    playlistThumbnail: string;
    videos: Video[];
    orderedId: number;
};

// ----- Union Course Content Item -----
export type CourseContentItem = {
    type: "video" | "playlist";
    position: number;
    video?: Video;
    playlist?: Playlist;
};

// ----- Course Interface (Frontend Version) -----
export interface Course {
    _id: string;
    title: string;
    description: string;    
    tags: string[];
    category: string[],
    price: number,
    viewsCount: number,
    likesCount: number,
    enrolledUserCount: number,
    isFree: boolean,
    faq?: {
        question: string;
        answer: string;
    }[];
    prerequisites: string[],
    courseThumbnail: string;
    shortDescription: string,
    level: 'beginner' | 'intermediate' | 'advanced'; // difficulty level
    courseLink: {
        link: string,
        position:number
    }[];
    language: string,
    duration?:number,
    courseContent: CourseContentItem[];
}
